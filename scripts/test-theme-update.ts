// Test script to verify theme update behavior
import { getDbService } from '../lib/mongodb'

async function testThemeUpdate() {
  console.log('\n🧪 Starting Theme Update Test...\n')
  
  try {
    const dbService = await getDbService()
    
    // 1. Get all themes
    console.log('1️⃣ Fetching all themes...')
    const themes = await dbService.getThemes()
    console.log(`   Found ${themes.length} themes`)
    
    // 2. Find HackTheBox theme
    const hackTheBoxTheme = themes.find((t: any) => t.name === 'HackTheBox Hacker')
    if (!hackTheBoxTheme) {
      console.error('❌ HackTheBox theme not found!')
      return
    }
    
    console.log('\n2️⃣ HackTheBox Theme Before Update:')
    console.log('   ID:', hackTheBoxTheme._id)
    console.log('   Colors:', JSON.stringify(hackTheBoxTheme.colors, null, 2))
    
    // 3. Test update - change ONLY textMuted
    console.log('\n3️⃣ Updating ONLY textMuted color...')
    const testUpdate = {
      colors: {
        textMuted: '#ffffff' // Change to white for testing
      }
    }
    
    console.log('   Sending update:', JSON.stringify(testUpdate, null, 2))
    const success = await dbService.updateTheme(hackTheBoxTheme._id, testUpdate)
    console.log('   Update success:', success)
    
    // 4. Fetch theme again to verify
    console.log('\n4️⃣ Fetching theme after update...')
    const updatedTheme = await dbService.getThemeById(hackTheBoxTheme._id)
    
    if (!updatedTheme) {
      console.error('❌ Could not fetch updated theme!')
      return
    }
    
    console.log('\n5️⃣ HackTheBox Theme After Update:')
    console.log('   Colors:', JSON.stringify(updatedTheme.colors, null, 2))
    
    // 6. Verify results
    console.log('\n6️⃣ Verification:')
    const allColorsPresent = ['primary', 'secondary', 'accent', 'background', 'foreground', 
                               'textPrimary', 'textSecondary', 'textMuted'].every(
      key => updatedTheme.colors && updatedTheme.colors[key]
    )
    
    if (allColorsPresent) {
      console.log('   ✅ All color properties are present')
    } else {
      console.log('   ❌ Some color properties are missing!')
      console.log('   Missing:', ['primary', 'secondary', 'accent', 'background', 'foreground', 
                                   'textPrimary', 'textSecondary', 'textMuted'].filter(
        key => !updatedTheme.colors || !updatedTheme.colors[key]
      ))
    }
    
    if (updatedTheme.colors?.textMuted === '#ffffff') {
      console.log('   ✅ textMuted was updated correctly to #ffffff')
    } else {
      console.log('   ❌ textMuted was NOT updated! Current value:', updatedTheme.colors?.textMuted)
    }
    
    if (updatedTheme.colors?.primary === hackTheBoxTheme.colors?.primary) {
      console.log('   ✅ primary color was preserved:', updatedTheme.colors.primary)
    } else {
      console.log('   ❌ primary color was changed! Before:', hackTheBoxTheme.colors?.primary, 'After:', updatedTheme.colors?.primary)
    }
    
    // 7. Restore original value
    console.log('\n7️⃣ Restoring original textMuted value...')
    await dbService.updateTheme(hackTheBoxTheme._id, {
      colors: {
        textMuted: hackTheBoxTheme.colors.textMuted
      }
    })
    console.log('   ✅ Restored')
    
    console.log('\n✅ Test completed!\n')
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error)
  }
  
  process.exit(0)
}

testThemeUpdate()
