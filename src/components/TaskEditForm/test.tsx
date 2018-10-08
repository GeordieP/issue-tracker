import * as React from 'react';
import { render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { taskMock } from 'testUtil/mocks';

// components
import TaskEditSegments from './Segments';

describe('Task edit form segments', () => {
    const spy = jest.fn();

    const { getByTestId } = render(
        <TaskEditSegments task={taskMock} onSubmit={spy}>
            {({ TitleField, BodyField, StatusField, SubmitBtn }: any) => (
                <React.Fragment>
                    <TitleField />
                    <BodyField />
                    <StatusField />
                    <SubmitBtn />
                </React.Fragment>
            )}
        </TaskEditSegments>
    );

    test('All fields are rendered', () => {
        expect(getByTestId('editTask_title')).toBeVisible();
        expect(getByTestId('editTask_body')).toBeVisible();
        expect(getByTestId('editTask_openStatus')).toBeVisible();
        expect(getByTestId('editTask_submit')).toBeVisible();
    });

    test('task ID field is readonly, disabled, and hidden', () => {
        const taskIDField = getByTestId('editTask_taskID');

        ['readonly', 'hidden', 'disabled'].forEach(attr => {
            expect(taskIDField).toHaveAttribute(attr);
        });
    });
});
