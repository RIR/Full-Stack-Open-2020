import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import BlogForm from './BlogForm';

describe('BlogForm', () => {
  test('calls callback with correct information when blog is created', () => {
    const createBlog = jest.fn();
    const component = render(<BlogForm createBlog={createBlog} />);

    const form = component.container.querySelector('form');
    const title = component.container.querySelector('[name="title"]');
    const author = component.container.querySelector('[name="author"]');
    const url = component.container.querySelector('[name="url"]');

    const titleValue = 'Test title';
    const authorValue = 'Test author';
    const urlValue = 'www.testurl.com';

    fireEvent.change(title, {
      target: { value: titleValue },
    });

    fireEvent.change(author, {
      target: { value: authorValue },
    });

    fireEvent.change(url, {
      target: { value: urlValue },
    });

    fireEvent.submit(form);

    const { title: resultTitle, author: resultAuthor, url: resultUrl } = createBlog.mock.calls[0][0];

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(resultTitle).toBe(titleValue);
    expect(resultAuthor).toBe(authorValue);
    expect(resultUrl).toBe(urlValue);
  });
});
