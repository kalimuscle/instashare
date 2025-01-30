import React from 'react';
import { render, screen } from '@testing-library/react';
import FormShareFile from '../../../components/forms/formShareFile';

describe('Form share file component', () => {

  test('renders loading component', () => {
    render(<FormShareFile />);
    expect(screen.getByText("File name")).toBeInTheDocument();
    expect(screen.getByText("Share file")).toBeInTheDocument();
  });

  test('renders component with props.item={object}', () => {
    render(<FormShareFile item={
      {
        name: 'File 1', 
        file: 'value',
        mimetype: 'image/png',
        size: 100

      }
    } />);
    expect(screen.getByText("File name")).toBeInTheDocument();
    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByText("Mime type")).toBeInTheDocument();
    expect(screen.getByText("Update file name")).toBeInTheDocument();
  });

});