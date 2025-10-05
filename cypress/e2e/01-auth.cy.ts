/// <reference types="cypress" />

describe('Admin Authentication Tests', () => {
  beforeEach(() => {
    cy.visit('/admin')
  })

  it('should display login form', () => {
    cy.get('input[name="username"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('should login with correct credentials', () => {
    cy.get('input[name="username"]').type('admin')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    
    // Should redirect to admin dashboard
    cy.url().should('include', '/admin')
    
    // Should show admin content
    cy.contains('Dashboard', { timeout: 10000 }).should('be.visible')
  })

  it('should show error with incorrect credentials', () => {
    cy.get('input[name="username"]').type('wronguser')
    cy.get('input[name="password"]').type('wrongpass')
    cy.get('button[type="submit"]').click()
    
    // Should show error message
    cy.contains(/invalid|error|wrong/i, { timeout: 5000 }).should('be.visible')
  })

  it('should validate required fields', () => {
    cy.get('button[type="submit"]').click()
    
    // Check for validation messages
    cy.get('input[name="username"]').should('have.attr', 'required')
    cy.get('input[name="password"]').should('have.attr', 'required')
  })
})
