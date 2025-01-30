import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../../../components/loading';

describe('Loading component', () => {

  test('renders loading component', () => {
    render(<Loading />);
  });

  test('renders loading component with props.label=`Loading`', () => {
    render(<Loading label="Loading" />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

});