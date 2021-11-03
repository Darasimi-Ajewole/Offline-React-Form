import Input from '../components/input';
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

test('renders Input component', () => {
  render(
    <Input
      value='Darasimi' type='text'
      name='firstName' placeholder='Your FirstName'
    />
  );

  expect(screen.getByRole('textbox')).toHaveValue('Darasimi')
});

test('input element is focus when text is provided', () => {
  const onChange = jest.fn()
  render(
    <Input
      type='email'
      name='email' placeholder="Email Address"
      onChange={onChange}
    />
  )
  const element = screen.getByRole('textbox')
  userEvent.paste(element, 'randEmail@email.com')
  expect(element).toHaveValue('')
  expect(element).toHaveFocus()
  expect(onChange).toBeCalled()
})