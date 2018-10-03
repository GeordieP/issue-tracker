describe('Sign up and log out', () => {
    // first user that signs up to this app is given admin permissions.
    it('Create first user and log out', () => {
        cy.app_signup('AdminUser', 'test', 'adminuser@test.com', 'Admin User');
        cy.contains('Log Out').click();
    });

    it('Create second user and log out', () => {
        cy.app_signup('SecondUser', 'test', 'seconduser@test.com', 'Second User');
        cy.contains('Log Out').click();
    });
});

describe('Log in and log out, verify permissions are correct', () => {
    it('Log in admin account, verify admin permissions, log out', () => {
        cy.app_login('adminuser@test.com', 'test',);
        cy.contains('New Project');
        cy.contains('Log Out').click();
        cy.url().should('eq', 'http://localhost:3000/');
    });

    it('Log in user account, verify no admin permissions, log out', () => {
        cy.app_login('seconduser@test.com', 'test');
        cy.contains('New Project').should('not.exist');
        cy.contains('Log Out').click();
        cy.url().should('eq', 'http://localhost:3000/');
    })
});
