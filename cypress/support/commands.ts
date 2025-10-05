/// <reference types="cypress" />

import '@testing-library/cypress/add-commands'

// Custom command for admin login
Cypress.Commands.add('adminLogin', () => {
  cy.visit('/admin')
  cy.get('input[name="username"]').type('admin')
  cy.get('input[name="password"]').type('admin123')
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/admin')
})

// Custom command to check if element is visible and clickable
Cypress.Commands.add('shouldBeClickable', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).should('be.visible').and('not.be.disabled')
})

// Declare custom commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      adminLogin(): Chainable<void>
      shouldBeClickable(): Chainable<Element>
    }
  }
}

export {}
