// util
const typing_noDelay = { delay: 0 }

Cypress.Commands.add('app_signup', (username, password, email, fullname) => {
    cy.visit('http://localhost:3000/signup');
    cy.get('[placeholder=Username]').type(username, typing_noDelay);
    cy.get('[placeholder=Password]').type(password, typing_noDelay);
    cy.get('[placeholder=Email]').type(email, typing_noDelay);
    cy.get('[placeholder="Full Name"]').type(fullname, typing_noDelay);
    cy.get('[type=Submit]').click();
    cy.url().should('eq', 'http://localhost:3000/');
});

Cypress.Commands.add('app_login', (email, password) => {
    cy.visit('http://localhost:3000/login');
    cy.get('[placeholder=Email]').type(email, typing_noDelay);
    cy.get('[placeholder=Password]').type(password, typing_noDelay);
    cy.get('[type=Submit]').click();
    cy.location('pathname')
        .should('eq', '/');
});

Cypress.Commands.add('app_fillCreateIssueForm', (title, body, severity, type) => {
    if (title) cy.get('[data-testid=createIssue_title]').clear().type(title, typing_noDelay);
    if (body) cy.get('[data-testid=createIssue_body]').clear().type(body, typing_noDelay);
    if (severity) cy.get('[data-testid=createIssue_severity]').select(severity);
    if (type) cy.get('[data-testid=createIssue_type]').select(type);
});

Cypress.Commands.add('app_fillEditIssueForm', (title, body, severity, type) => {
    if (title) cy.get('[data-testid=editIssue_title]').clear().type(title, typing_noDelay);
    if (body) cy.get('[data-testid=editIssue_body]').clear().type(body, typing_noDelay);
    if (severity) cy.get('[data-testid=editIssue_severity]').select(severity);
    if (type) cy.get('[data-testid=editIssue_type]').select(type);
});

Cypress.Commands.add('app_fillCreateTaskForm', (title, body, open = true) => {
    if (title) cy.get('[data-testid=createTask_title]').clear().type(title, typing_noDelay);
    if (body) cy.get('[data-testid=createTask_body]').clear().type(body, typing_noDelay);

    const identifier = '[data-testid=createTask_openStatus]';
    if (open) cy.get(identifier).check();
         else cy.get(identifier).uncheck();
});

Cypress.Commands.add('app_fillEditTaskForm', (title, body, open = true) => {
    if (title) cy.get('[data-testid=editTask_title]').clear().type(title, typing_noDelay);
    if (body) cy.get('[data-testid=editTask_body]').clear().type(body, typing_noDelay);

    const identifier = '[data-testid=editTask_openStatus]';
    if (open) cy.get(identifier).check();
         else cy.get(identifier).uncheck();
});
