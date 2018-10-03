// util
const typing_noDelay = { delay: 0 }
// constants used throughout the test
const RUN_ID = Date.now();

describe('Admin create/edit/delete flows', () => {
    it('Log in as admin and create project', () => {
        Cypress.Cookies.defaults({ whitelist: [] });
        cy.clearCookies();
        // whitelist our session cookies for the rest of the test
        Cypress.Cookies.defaults({
            whitelist: ['koa:sess', 'koa:sess.sig']
        });

        cy.app_login('adminuser@test.com', 'test');

        cy.contains('New Project').click();
        cy.get('[placeholder=Name]').type(`${RUN_ID}_Project`, typing_noDelay);
        cy.get('[placeholder=Alias]').type(`${RUN_ID}_P, typing_noDelay`);
        cy.get('[type=Submit]').click();

        cy.url().should('contain', 'localhost:3000/projectDetails');
    });

    // ISSUES

    it('Create issue', () => {
        cy.contains('New Issue').click();
        const bodyText = 'First issue contents before edit';
        cy.app_fillCreateIssueForm(`${RUN_ID}_Issue-1`, bodyText, 'High');
        cy.get('[data-testid=createIssue_submit]').click();

        // did we navigate?
        cy.url().should('contain', '/issues/');

        // verify issue contents
        cy.get('.IssueView-content').within(() => {
            // author username
            cy.root().should('contain', 'AdminUser');
            // severity
            cy.root().should('contain', 'high');
            // body text
            cy.root().should('contain', bodyText);
        });
    });

    it('Edit issue', () => {
        cy.contains('Edit Issue').click();
        const bodyText = 'First issue contents after edit';
        cy.app_fillEditIssueForm(`${RUN_ID}_Issue-1 EDITED`, bodyText, 'Low');
        cy.contains('Save Issue').click();

        // wait for issue details to be rendered, signifying the save completed
        cy.get('.Issue-details');

        // verify issue contents
        cy.get('.IssueView-content').within(() => {
            // severity
            cy.root().should('contain', 'low');
            // body text
            cy.root().should('contain', bodyText);
        });
    });

    it('Delete issue', () => {
        cy.contains('Delete Issue').click();
        // did we navigate? we deleted the only issue, and should be back on
        // the project details page.
        cy.url().should('contain', '/projectDetails');
    });

    // TASKS

    it('Create task', () => {
        // Create an issue to work on
        cy.contains('New Issue').click();
        cy.app_fillCreateIssueForm(
            `${RUN_ID}_Issue-2`,
            'Issue for testing tasks and comments.'
        );
        cy.get('[data-testid=createIssue_submit]').click();

        // create task
        const taskTitle = 'First Task';
        const taskBodyText = 'First task content before edit';
        cy.app_fillCreateTaskForm(taskTitle, taskBodyText);
        cy.get('[data-testid=createTask_submit]').click();

        // verify task appeared in task list, and click on it
        cy.get('.IssueView-sidebar').contains(taskTitle).click();
        // did we navigate?
        cy.url().should('contain', '/tasks');

        cy.get('.TaskView').within(() => {
            // title
            cy.root().should('contain', taskTitle);
            // body
            cy.root().should('contain', taskBodyText);
        });
    });

    it('Edit task', () => {
        cy.contains('Edit Task').click();
        const taskTitle = 'First Task EDITED';
        const taskBodyText = 'First task content edited';
        cy.app_fillEditTaskForm(taskTitle, taskBodyText);
        cy.contains('Save Task').click();

        // wait for edit button to come back, signifying the save action completed
        cy.contains('Edit Task');

        cy.get('.TaskView').within(() => {
            // title
            cy.root().should('contain', taskTitle);
            // body
            cy.root().should('contain', taskBodyText);
        });
    });

    it('Delete task', () => {
        cy.contains('Delete Task').click();

        // did we navigate?
        cy.url().should('not.contain', '/tasks');

        cy.get('.IssueView-sidebar').should('contain', 'No tasks.');
    });

    // COMMENTS

    it('Create issue comment', () => {
        const commentBody = 'First Comment';
        cy.get('[data-testid="createComment_body"]').type(commentBody, typing_noDelay);
        cy.contains('Submit Comment').click();

        // verify comment exists
        cy.get('.MutableComment-commentDetails').should('contain', commentBody);
    });

    it('Edit issue comment', () => {
        cy.contains('Edit Comment').click();
        const commentBody = 'First comment after edit';
        cy.get('[data-testid=editComment_body]').type(commentBody, typing_noDelay);
        cy.contains('Save Comment').click();

        // verify comment was updated
        cy.get('.MutableComment-commentDetails').should('contain', commentBody);
    });

    it('Delete issue comment', () => {
        cy.contains('Delete Comment').click();
        cy.get('.MutableComment-commentDetails').should('not.exist');
    });

    it('Create task, create comment in task', () => {
        const taskTitle = 'Test Task';
        cy.app_fillCreateTaskForm(taskTitle, '');
        cy.get('[data-testid=createTask_submit]').click();

        // verify task appeared in task list, and click on it
        cy.get('.IssueView-sidebar').contains(taskTitle).click();

        const commentBody = 'Task Comment';
        cy.get('[data-testid="createComment_body"]').type(commentBody, typing_noDelay);
        cy.contains('Submit Comment').click();

        // verify comment exists
        cy.get('.MutableComment-commentDetails').should('contain', commentBody);
    });

    it('Edit task comment', () => {
        cy.contains('Edit Comment').click();

        const commentBody = 'Task comment after edit';
        cy.get('[data-testid=editComment_body]').type(commentBody, typing_noDelay);
        cy.contains('Save Comment').click();

        // verify comment was updated
        cy.get('.MutableComment-commentDetails').should('contain', commentBody);
    });

    it('Delete task comment', () => {
        cy.contains('Delete Comment').click();
        cy.get('.MutableComment-commentDetails').should('not.exist');
    });

    it('Log out', () => {
        cy.contains('Log Out').click();
    })
});
