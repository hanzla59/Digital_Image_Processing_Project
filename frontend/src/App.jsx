// import React, { useState } from 'react';
// import axios from 'axios';
// import { Container, Button, TextField, Box, Typography, Select, MenuItem, InputLabel, FormControl, CircularProgress } from '@mui/material';
// import { useDropzone } from 'react-dropzone';

// const App = () => {
//   const [image, setImage] = useState(null);
//   const [processedImage, setProcessedImage] = useState(null);
//   const [filter, setFilter] = useState('');
//   const [gamma, setGamma] = useState(1.0); // For gamma correction
//   const [filterType, setFilterType] = useState(''); // For low-pass and high-pass filter types
//   const [cutoff, setCutoff] = useState(''); // For the cutoff frequency
//   const [loading, setLoading] = useState(false); // Loading indicator

//   // Handle image drop
//   const onDrop = (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     setImage(file);
//     setProcessedImage(URL.createObjectURL(file)); // Display the uploaded image immediately
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: 'image/*',
//     onDrop,
//   });

//   // Handle filter change
//   const handleFilterChange = (event) => {
//     setFilter(event.target.value);
//     setGamma(1.0); // Reset inputs when changing filters
//     setFilterType(''); // Reset filter type
//     setCutoff(''); // Reset cutoff frequency
//   };

//   // Handle filter submission
//   const handleSubmit = async () => {
//     setLoading(true); // Show loading indicator
//     const formData = new FormData();
//     formData.append('image', image);

//     // Add filter-specific parameters
//     if (filter === 'apply_gamma') {
//       formData.append('gamma', gamma);
//     } else if (filter === 'apply_lowpass' || filter === 'apply_highpass') {
//       formData.append('filter_type', filterType); // Change to match backend
//       formData.append('cutoff', parseInt(cutoff, 10)); // Ensure cutoff is sent as an integer
//     }

//     try {
//       const response = await axios.post(`http://127.0.0.1:5000/${filter}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         responseType: 'blob', // Ensure the response is a Blob
//       });

//       // If the response is a Blob, create a URL for it
//       const imageUrl = URL.createObjectURL(response.data);
//       setProcessedImage(imageUrl); // Show processed image
//     } catch (error) {
//       console.error('Error processing image:', error);
//     } finally {
//       setLoading(false); // Hide loading indicator
//     }
//   };

//   return (
//     <Container sx={{ marginTop: 4 }}>
//       {/* Heading */}
//       <Typography variant="h4" align="center" gutterBottom>
//         Digital Image Processing Project
//       </Typography>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
//         {/* Left Section: Input Image */}
//         <Box
//           sx={{
//             width: '45%',
//             height: '400px',
//             border: '2px dashed #ccc',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             flexDirection: 'column',
//             textAlign: 'center',
//           }}
//         >
//           <Typography variant="h6" gutterBottom>
//             Input Image
//           </Typography>
//           {image ? (
//             <Box component="img" src={URL.createObjectURL(image)} alt="Input" sx={{ maxWidth: '100%', maxHeight: '90%' }} />
//           ) : (
//             <Box {...getRootProps()} sx={{ width: '100%', height: '100%' }}>
//               <input {...getInputProps()} />
//               <Typography variant="body1">Drag & Drop an Image Here, or Click to Select</Typography>
//             </Box>
//           )}
//         </Box>

//         {/* Right Section: Processed Image */}
//         <Box
//           sx={{
//             width: '45%',
//             height: '400px',
//             border: '2px dashed #ccc',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             flexDirection: 'column',
//             textAlign: 'center',
//           }}
//         >
//           <Typography variant="h6" gutterBottom>
//             Processed Image
//           </Typography>
//           {loading ? (
//             <CircularProgress />
//           ) : processedImage ? (
//             <Box component="img" src={processedImage} alt="Processed" sx={{ maxWidth: '100%', maxHeight: '90%' }} />
//           ) : (
//             <Typography variant="body1">Processed Image Will Appear Here</Typography>
//           )}
//         </Box>
//       </Box>

//       {/* Dropdown for filter selection */}
//       <Box sx={{ marginTop: 4 }}>
//         <FormControl fullWidth>
//           <InputLabel>Filter</InputLabel>
//           <Select
//             value={filter}
//             onChange={handleFilterChange}
//             label="Filter"
//             fullWidth
//           >
//             <MenuItem value="apply_gamma">Gamma Correction</MenuItem>
//             <MenuItem value="apply_histogram">Histogram Equalization</MenuItem>
//             <MenuItem value="apply_laplacian">Laplacian Filter</MenuItem>
//             <MenuItem value="apply_sobel">Sobel Operator</MenuItem>
//             <MenuItem value="apply_lowpass">Low-pass Filtering</MenuItem>
//             <MenuItem value="apply_highpass">High-pass Filtering</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       {/* Conditional Inputs for selected filter */}
//       {filter === 'apply_gamma' && (
//         <Box sx={{ marginTop: 2 }}>
//           <TextField
//             label="Gamma"
//             type="number"
//             value={gamma}
//             onChange={(e) => setGamma(parseFloat(e.target.value))}
//             sx={{ width: '200px' }}
//             inputProps={{ min: 0 }}
//           />
//         </Box>
//       )}

//       {(filter === 'apply_lowpass' || filter === 'apply_highpass') && (
//         <>
//           <Box sx={{ marginTop: 2 }}>
//             <FormControl fullWidth>
//               <InputLabel>Filter Type</InputLabel>
//               <Select
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//                 label="Filter Type"
//                 fullWidth
//               >
//                 <MenuItem value="ideal">Ideal</MenuItem>
//                 <MenuItem value="butterworth">Butterworth</MenuItem>
//                 <MenuItem value="gaussian">Gaussian</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>
//           <Box sx={{ marginTop: 2 }}>
//             <TextField
//               label="Cutoff Frequency"
//               type="number"
//               value={cutoff}
//               onChange={(e) => setCutoff(e.target.value)}
//               sx={{ width: '200px' }}
//               inputProps={{ min: 0 }}
//             />
//           </Box>
//         </>
//       )}

//       {/* Submit button */}
//       <Box sx={{ marginTop: 4 }}>
//         <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!image || !filter}>
//           Apply Filter
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default App;













import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Button,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const App = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [filter, setFilter] = useState('');
  const [gamma, setGamma] = useState(1.0);
  const [filterType, setFilterType] = useState('');
  const [cutoff, setCutoff] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove the selected image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setProcessedImage(null);
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setGamma(1.0);
    setFilterType('');
    setCutoff('');
  };

  // Handle image processing
  const handleSubmit = async () => {
    if (!image || !filter) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    if (filter === 'apply_gamma') {
      formData.append('gamma', gamma);
    } else if (filter === 'apply_lowpass' || filter === 'apply_highpass') {
      formData.append('filter_type', filterType);
      formData.append('cutoff', parseInt(cutoff, 10));
    }

    try {
      const response = await axios.post(`http://127.0.0.1:5000/${filter}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });
      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(imageUrl);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Page Header */}
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', padding: 2 }}>
        Digital Image Processing Project
      </Typography>

      {/* Image Upload and Preview */}
      <Box display="flex" justifyContent="space-between" gap={3} mt={4} flexWrap="wrap">
        {/* Input Image Box */}
        <Box
          sx={{
            width: { xs: '100%', md: '45%' },
            height: '400px',
            border: '2px dashed #ccc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Input Image
          </Typography>
          {imagePreview ? (
            <>
              <Box
                component="img"
                src={imagePreview}
                alt="Selected"
                sx={{ maxWidth: '100%', maxHeight: '90%' }}
              />
              <IconButton
                onClick={handleRemoveImage}
                sx={{ position: 'absolute', top: 8, right: 8 }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </>
          ) : (
            <>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-button"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="upload-button">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Image
                </Button>
              </label>
            </>
          )}
        </Box>

        {/* Processed Image Box */}
        <Box
          sx={{
            width: { xs: '100%', md: '45%' },
            height: '400px',
            border: '2px dashed #ccc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : processedImage ? (
            <>
            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

            <Typography variant="h6" gutterBottom>
              Processed Image
            </Typography>
            <Box
              component="img"
              src={processedImage}
              alt="Processed"
              sx={{ maxWidth: '100%', maxHeight: '90%' }}
            />
            </div>
            </>
          ) : (
            <Typography variant="body1">Processed Image Will Appear Here</Typography>
          )}
        </Box>
      </Box>

      {/* Filter Selection */}
      <Box mt={4}>
        <FormControl fullWidth>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} onChange={handleFilterChange} label="Filter">
            <MenuItem value="apply_gamma">Gamma Correction</MenuItem>
            <MenuItem value="apply_histogram">Histogram Equalization</MenuItem>
            <MenuItem value="apply_laplacian">Laplacian Filter</MenuItem>
            <MenuItem value="apply_sobel">Sobel Operator</MenuItem>
            <MenuItem value="apply_lowpass">Low-pass Filtering</MenuItem>
            <MenuItem value="apply_highpass">High-pass Filtering</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Dynamic Input Fields */}
      {filter === 'apply_gamma' && (
        <Box mt={2}>
          <TextField
            label="Gamma"
            type="number"
            value={gamma}
            onChange={(e) => setGamma(parseFloat(e.target.value))}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Box>
      )}

      {(filter === 'apply_lowpass' || filter === 'apply_highpass') && (
        <>
          <Box mt={2}>
            <FormControl fullWidth>
              <InputLabel>Filter Type</InputLabel>
              <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="Filter Type">
                <MenuItem value="ideal">Ideal</MenuItem>
                <MenuItem value="butterworth">Butterworth</MenuItem>
                <MenuItem value="gaussian">Gaussian</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mt={2}>
            <TextField
              label="Cutoff Frequency"
              type="number"
              value={cutoff}
              onChange={(e) => setCutoff(e.target.value)}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Box>
        </>
      )}

      {/* Submit Button */}
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!image || !filter}
          fullWidth
        >
          Apply Filter
        </Button>
      </Box>
    </Container>
  );
};

export default App;

























































// import React, { useState } from 'react';
// import axios from 'axios';
// import { Container, Button, TextField, Box, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
// import { useDropzone } from 'react-dropzone';

// const App = () => {
//   const [image, setImage] = useState(null);
//   const [processedImage, setProcessedImage] = useState(null);
//   const [filter, setFilter] = useState('');
//   const [gamma, setGamma] = useState(1.0); // For gamma correction
//   const [filterType, setFilterType] = useState(''); // For low-pass and high-pass filter types
//   const [cutoff, setCutoff] = useState(''); // For the cutoff frequency

//   // Handle image drop
//   const onDrop = (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     setImage(file);
//     setProcessedImage(URL.createObjectURL(file)); // Display the uploaded image immediately
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: 'image/*',
//     onDrop,
//   });

//   // Handle filter change
//   const handleFilterChange = (event) => {
//     setFilter(event.target.value);
//     setGamma(1.0); // Reset inputs when changing filters
//     setFilterType(''); // Reset filter type
//     setCutoff(''); // Reset cutoff frequency
//   };

//   // Handle filter submission
//   // Handle filter submission
// const handleSubmit = async () => {
//   const formData = new FormData();
//   formData.append('image', image);

//   // Add filter-specific parameters
//   if (filter === 'apply_gamma') {
//     formData.append('gamma', gamma);
//   } else if (filter === 'apply_lowpass' || filter === 'apply_highpass') {
//     formData.append('filter_type', filterType); // Change to match backend
//     formData.append('cutoff', parseInt(cutoff, 10)); // Ensure cutoff is sent as an integer
//   }

//   try {
//     const response = await axios.post(`http://127.0.0.1:5000/${filter}`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//       responseType: 'blob', // Ensure the response is a Blob
//     });

//     // If the response is a Blob, create a URL for it
//     const imageUrl = URL.createObjectURL(response.data);
//     setProcessedImage(imageUrl); // Show processed image
//   } catch (error) {
//     console.error('Error processing image:', error);
//   }
// };


//   return (
//     <Container>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
//         {/* Left Section: Image Uploader */}
//         <Box
//           {...getRootProps()}
//           sx={{
//             width: '45%',
//             height: '400px',
//             border: '2px dashed #ccc',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             textAlign: 'center',
//           }}
//         >
//           <input {...getInputProps()} />
//           <Typography variant="h6">Drag & Drop an Image Here, or Click to Select</Typography>
//         </Box>

//         {/* Right Section: Processed Image */}
//         <Box sx={{ width: '45%', height: '400px', border: '2px dashed #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//           {processedImage ? (
//             <Box component="img" src={processedImage} alt="Processed" sx={{ maxWidth: '100%', height: 'auto' }} />
//           ) : (
//             <Typography variant="h6">Processed Image Will Appear Here</Typography>
//           )}
//         </Box>
//       </Box>

//       {/* Dropdown for filter selection */}
//       <Box sx={{ marginTop: 2 }}>
//         <FormControl fullWidth>
//           <InputLabel>Filter</InputLabel>
//           <Select
//             value={filter}
//             onChange={handleFilterChange}
//             label="Filter"
//             fullWidth
//           >
//             <MenuItem value="apply_gamma">Gamma Correction</MenuItem>
//             <MenuItem value="apply_histogram">Histogram Equalization</MenuItem>
//             <MenuItem value="apply_laplacian">Laplacian Filter</MenuItem>
//             <MenuItem value="apply_sobel">Sobel Operator</MenuItem>
//             <MenuItem value="apply_lowpass">Low-pass Filtering</MenuItem>
//             <MenuItem value="apply_highpass">High-pass Filtering</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       {/* Conditional Inputs for selected filter */}
//       {filter === 'apply_gamma' && (
//         <Box sx={{ marginTop: 2 }}>
//           <TextField
//             label="Gamma"
//             type="number"
//             value={gamma}
//             onChange={(e) => setGamma(parseFloat(e.target.value))}
//             sx={{ width: '200px' }}
//             inputProps={{ min: 0 }}
//           />
//         </Box>
//       )}

//       {(filter === 'apply_lowpass' || filter === 'apply_highpass') && (
//         <Box sx={{ marginTop: 2 }}>
//           <FormControl fullWidth>
//             <InputLabel>Filter Type</InputLabel>
//             <Select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               label="Filter Type"
//               fullWidth
//             >
//               <MenuItem value="ideal">Ideal</MenuItem>
//               <MenuItem value="butterworth">Butterworth</MenuItem>
//               <MenuItem value="gaussian">Gaussian</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>
//       )}

//       {(filter === 'apply_lowpass' || filter === 'apply_highpass') && (
//         <Box sx={{ marginTop: 2 }}>
//           <TextField
//             label="Cutoff Frequency"
//             type="number"
//             value={cutoff}
//             onChange={(e) => setCutoff(e.target.value)}
//             sx={{ width: '200px' }}
//             inputProps={{ min: 0 }}
//           />
//         </Box>
//       )}

//       {/* Submit button */}
//       <Box sx={{ marginTop: 2 }}>
//         <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!image || !filter}>
//           Apply Filter
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default App;
