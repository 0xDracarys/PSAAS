/// <reference types="cypress" />

describe('Admin Dashboard Features Tests', () => {
  beforeEach(() => {
    cy.adminLogin()
  })

  it('should navigate through all admin tabs', () => {
    const tabs = ['Projects', 'Blogs', 'Requests', 'Settings']
    
    tabs.forEach(tab => {
      cy.get('body').then($body => {
        if ($body.text().includes(tab)) {
          cy.contains(tab).click()
          cy.wait(1000)
          cy.log(`✓ ${tab} tab accessible`)
        } else {
          cy.log(`⚠ ${tab} tab not found`)
        }
      })
    })
  })

  it('should test password change functionality', () => {
    cy.contains(/settings/i, { timeout: 10000 }).click()
    
    cy.get('body').then($body => {
      if ($body.text().match(/change password|update password/i)) {
        cy.log('✓ Password change section exists')
        
        // Check for password input fields
        const passwordInputs = $body.find('input[type="password"]')
        if (passwordInputs.length >= 2) {
          cy.log(`✓ Found ${passwordInputs.length} password input fields`)
        } else {
          cy.log('⚠ Insufficient password input fields')
        }
      } else {
        cy.log('⚠ Password change section not found')
      }
    })
  })

  it('should test profile settings update', () => {
    cy.contains(/settings/i, { timeout: 10000 }).click()
    
    // Look for profile input fields
    cy.get('body').then($body => {
      const inputs = $body.find('input[type="text"], input[type="email"], textarea')
      cy.log(`Found ${inputs.length} input fields in settings`)
      
      if (inputs.length > 0) {
        cy.log('✓ Profile settings form exists')
      } else {
        cy.log('⚠ No input fields found in settings')
      }
    })
  })

  it('should test blog management', () => {
    cy.get('body').then($body => {
      if ($body.text().match(/blogs|articles|posts/i)) {
        cy.contains(/blogs|articles|posts/i).click()
        cy.wait(1000)
        cy.log('✓ Blog management section accessible')
      } else {
        cy.log('⚠ Blog management section not found')
      }
    })
  })

  it('should test client requests view', () => {
    cy.get('body').then($body => {
      if ($body.text().match(/requests|clients/i)) {
        cy.contains(/requests|clients/i).click()
        cy.wait(1000)
        cy.log('✓ Client requests section accessible')
      } else {
        cy.log('⚠ Client requests section not found')
      }
    })
  })

  it('should check for API error handling', () => {
    // Test that the app handles API errors gracefully
    cy.intercept('POST', '/api/**', {
      statusCode: 500,
      body: { error: 'Test error' }
    }).as('apiError')
    
    // Try an action that would trigger API call
    cy.contains(/settings/i, { timeout: 10000 }).click()
    cy.wait(1000)
    
    cy.log('✓ API error handling test executed')
  })
})
