import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('Blog', () => {
  let blog;

  beforeEach(() => {
    blog = {
      title: 'Test Title',
      author: 'Test Author',
      url: 'www.testurl.com',
      likes: 1,
      user: { username: 'test user' },
    };
  });

  test('renders default content', () => {
    const component = render(<Blog blog={blog} />);

    expect(component.container).toHaveTextContent('Test Title');
    expect(component.container).toHaveTextContent('Test Author');
    expect(component.container).not.toHaveTextContent('www.testurl.com');

    const div = component.container.querySelector('.likes');
    expect(div).toBe(null);
  });

  test('renders all content after display button is pressed', () => {
    const component = render(<Blog blog={blog} user={{ username: 'random' }} />);

    expect(component.container).toHaveTextContent('Test Title');
    expect(component.container).toHaveTextContent('Test Author');

    const displayButton = component.getByText('view');
    fireEvent.click(displayButton);

    expect(component.container).toHaveTextContent('www.testurl.com');
    const likes = component.container.querySelector('.likes');
    expect(likes).toBeVisible();
    expect(likes).toHaveTextContent(1);
  });

  test('like button fires correctly', () => {
      const likeMockHandler = jest.fn()
    const component = render(<Blog blog={blog} user={{ username: 'random' }} like={likeMockHandler} />);

    expect(component.container).toHaveTextContent('Test Title');
    expect(component.container).toHaveTextContent('Test Author');

    // Has to be done so the like button is displayed
    const displayButton = component.getByText('view');
    fireEvent.click(displayButton);

    const likeButton = component.getByText('like');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(likeMockHandler.mock.calls).toHaveLength(2)
  });
});
