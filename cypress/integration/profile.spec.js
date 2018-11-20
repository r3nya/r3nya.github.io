context('Profile', () => {
  beforeEach(() => cy.openSite());

  it('has correct first name and last name', () => {
    cy.get('.name').contains('Andrey Makarov');
  });

  it('has correct description', () => {
    cy.get('.about').contains('JS Developer');
  });
});
