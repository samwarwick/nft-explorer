import { render, screen } from '@testing-library/react';
import App from './App';

test('Shows the NFT explorer', () => {
  render(<App />);
  const linkElement = screen.getByText(/NFT Explorer/i);
  expect(linkElement).toBeInTheDocument();
});
