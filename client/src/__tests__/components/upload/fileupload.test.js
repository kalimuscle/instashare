import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { useDropzone } from 'react-dropzone';
import FileUpload from '../../../components/upload/fileupload'; 

// Mock react-dropzone
jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn(),
}));

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('FileUpload Component', () => {
  // Setup default mocks before each test
  beforeEach(() => {
    useDropzone.mockImplementation(() => ({
      getRootProps: () => ({ onClick: jest.fn() }),
      getInputProps: () => ({}),
      open: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<FileUpload onChange={() => {}} />);
    expect(screen.getByText("Drag 'n' drop some files here, or click to select files")).toBeInTheDocument();
    expect(screen.getByText('Open File Dialog')).toBeInTheDocument();
  });
});