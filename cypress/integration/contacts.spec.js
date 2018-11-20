/// <reference types="Cypress" />

const CONTACTS = [
  'https://github.com/r3nya',
  'https://www.linkedin.com/in/r3nya',
  'https://twitter.com/r3nya',
  'http://instagram.com/r3nya',
  'http://www.lastfm.ru/user/true_renya',
  'https://t.me/r3nya',
];

context('contacts', () => {
  beforeEach(() => cy.openSite());

  it('has contact list', () => {
    cy.get('main.one-half a').should('have.length', 6);
  });

  describe('links', () => {
    it('has correct CSS class', () => {
      cy.get('a')
        .each(($el) => {
          cy.wrap($el)
            .parent()
            .should('have.class', 'link');
        });
    });

    it('has correct link', () => {
      cy.get('a')
        .each(($el) => {
          CONTACTS.includes($el);
        });
    });
  });

});
