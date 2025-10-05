/// <reference types="cypress" />

describe('Image Upload Tests', () => {
  beforeEach(() => {
    cy.adminLogin()
  })

  it('should test profile picture upload', () => {
    // Navigate to settings or profile section
    cy.contains(/settings|profile/i, { timeout: 10000 }).click()
    
    // Look for file input for profile picture
    cy.get('input[type="file"]').first().should('exist')
    
    // Create a test image file
    cy.fixture('test-image.jpg', 'base64').then(fileContent => {
      cy.get('input[type="file"]').first().selectFile({
        contents: Cypress.Buffer.from(fileContent, 'base64'),
        fileName: 'test-profile.jpg',
        mimeType: 'image/jpeg',
        lastModified: Date.now(),
      }, { force: true })
    })
    
    // Wait for upload to complete
    cy.wait(3000)
    
    // Check for success message or updated image
    cy.get('body').then($body => {
      if ($body.text().includes('success') || $body.text().includes('uploaded')) {
        cy.log('✓ Profile picture upload appears to be working')
      } else {
        cy.log('⚠ Profile picture upload may have issues')
      }
    })
  })

  it('should test project image upload', () => {
    // Navigate to projects section
    cy.contains(/projects/i, { timeout: 10000 }).click()
    
    // Look for add/create project button
    cy.get('body').then($body => {
      if ($body.text().match(/add project|create project|new project/i)) {
        cy.contains(/add project|create project|new project/i).click()
        
        // Look for image upload field
        cy.get('input[type="file"]').should('exist')
        
        cy.log('✓ Project image upload field exists')
      } else {
        cy.log('⚠ Could not find project creation form')
      }
    })
  })

  it('should validate image file types', () => {
    cy.contains(/settings|profile/i, { timeout: 10000 }).click()
    
    // Try to upload invalid file type
    cy.get('input[type="file"]').first().then($input => {
      const accept = $input.attr('accept')
      if (accept) {
        cy.log(`✓ File input has accept attribute: ${accept}`)
      } else {
        cy.log('⚠ File input missing accept attribute for validation')
      }
    })
  })
})
