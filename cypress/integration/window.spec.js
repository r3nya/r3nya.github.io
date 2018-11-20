/// <reference types="Cypress" />

context('window', () => {
  beforeEach(() => cy.openSite());

  it('has correct charset', () => {
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8');
  });

  it('has correct title', () => {
    cy.title().should('include', 'Andrey Makarov aka r3nya');
  });
});
