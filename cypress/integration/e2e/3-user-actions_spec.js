// util
const typing_noDelay = { delay: 0 }
// constants used throughout the test
const RUN_ID = Date.now();
const projectName = `${RUN_ID}_Project`;
const issueName = `${RUN_ID}_Issue-1`;
const issueBody = 'First issue contents';
const taskTitle = 'First task';
const taskBody = 'First task body';
const issueCommentBody = 'Issue comment body';
const taskCommentBody = 'Task comment body';

describe('Admin setup', () => {
    it('Set up app for user testing', () => {
        Cypress.Cookies.defaults({ whitelist: [] });
        cy.clearCookies();
        // whitelist our session cookies for the rest of the test
        Cypress.Cookies.defaults({
            whitelist: ['koa:sess', 'koa:sess.sig']
        });

        // log in as admin
        cy.app_login('adminuser@test.com', 'test');

        // create project
        cy.contains('New Project').click();
        cy.get('[placeholder=Name]').type(projectName, typing_noDelay);
        cy.get('[placeholder=Alias]').type(`${RUN_ID}_P`, typing_noDelay);
        cy.get('[type=Submit]').click();
        cy.url().should('contain', 'localhost:3000/projectDetails');

        // create issue
        cy.contains('New Issue').click();
        cy.app_fillCreateIssueForm(issueName, issueBody);
        cy.get('[data-testid="createIssue_submit"]').click();
        cy.url().should('contain', '/issues/');

        // comment on issue
        cy.get('[data-testid="createComment_body"]').type(issueCommentBody, typing_noDelay);
        cy.contains('Submit Comment').click();

        // create task and navigate to it
        cy.app_fillCreateTaskForm(taskTitle, taskBody);
        cy.get('[data-testid="createTask_submit"]').click();
        cy.get('.IssueView-sidebar').contains(taskTitle).click();

        // comment on task
        cy.get('[data-testid="createComment_body"]').type(taskCommentBody, typing_noDelay);
        cy.contains('Submit Comment').click();

        // log out
        cy.get('#logout').click();
    });
});

describe('User create/edit/delete flows', () => {
    it('Log in as normal user', () => {
        cy.app_login('seconduser@test.com', 'test');
    });

    it('Issue page permissions verification', () => {
        // navigate to project
        cy.contains(projectName).click();

        // verify first issue exists and body is visible
        cy.contains(issueName);
        cy.contains(issueBody);

        // verify admin comment is visible and not editable
        cy.contains(issueCommentBody);
        cy.get('[data-testid="editComment"]').should('not.exist');

        // verify issue buttons are not visible
        cy.get('[data-testid="editIssue"]').should('not.exist');
        cy.get('[data-testid="deleteIssue"]').should('not.exist');
    });

    it('Task page permissions verification', () => {
        // verify task is visible, and click on it
        cy.contains(taskTitle).click();

        // did we navigate?
        cy.url().should('contain', '/tasks');

        // verify task body is visible
        cy.contains(taskBody);

        // verify admin comment is visible and not editable
        cy.contains(taskCommentBody);
        cy.get('[data-testid="editComment"]').should('not.exist');

        // verify issue buttons are not visible
        cy.get('[data-testid="editIssue"]').should('not.exist');
        cy.get('[data-testid="deleteIssue"]').should('not.exist');
    });

    it('Task page comments', () => {
        const myCommentBody = 'user comment';
        const myCommentBody_edit = 'user comment after edit';

        // create task comment
        cy.get('[data-testid="createComment_body"]').type(myCommentBody, typing_noDelay);
        cy.contains('Submit Comment').click();

        // verify comment was created and is visible
        cy.contains(myCommentBody);

        // edit the comment
        cy.get('[data-testid="editComment"]').click();
        cy.get('[data-testid="editComment_body"]').clear().type(myCommentBody_edit, typing_noDelay);
        cy.get('[data-testid="editComment_submit"]').click();

        // verify comment was edited and is visible
        cy.contains(myCommentBody_edit);

        // delete comment
        cy.get('[data-testid="deleteComment"]').click();

        // verify comment was deleted
        cy.contains(myCommentBody_edit).should('not.exist');
    });

    it('Issue page comments', () => {
        const myCommentBody = 'user comment';
        const myCommentBody_edit = 'user comment after edit';

        // navigate back to issue page
        cy.get('.IssueList-item').contains(issueName).click();

        // did we navigate?
        cy.url().should('not.contain', '/tasks');

        // create issue comment
        cy.get('[data-testid="createComment_body"]').type(myCommentBody, typing_noDelay);
        cy.contains('Submit Comment').click();

        // verify comment was created and is visible
        cy.get('.Comment').should('contain', myCommentBody);

        // edit the comment
        cy.get('[data-testid="editComment"]').click();
        cy.get('[data-testid="editComment_body"]').clear().type(myCommentBody_edit, typing_noDelay);
        cy.get('[data-testid="editComment_submit"]').click();

        // verify comment was edited and is visible
        cy.contains(myCommentBody_edit);

        // delete comment
        cy.get('[data-testid="deleteComment"]').click();

        // verify comment was deleted
        cy.contains(myCommentBody_edit).should('not.exist');
    });

    it('Log out user', () => {
        cy.get('#logout').click();
    });
});
