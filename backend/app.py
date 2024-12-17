from flask import Flask, request, jsonify, send_file
import numpy as np
import cv2
import os
from io import BytesIO
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Helper function to save and return images as a response
def save_and_return_image(image_array):
    img = Image.fromarray(image_array)
    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png')

# Route for Gamma Correction
@app.route('/apply_gamma', methods=['POST'])
def apply_gamma():
    try:
        image_file = request.files['image']
        gamma = float(request.form['gamma'])  # Gamma value from request

        # Read image and apply gamma correction
        image = Image.open(image_file).convert('RGB')
        image = np.array(image)
        
        # Normalize image to [0, 1] range
        normalized = image / 255.0
        
        # Apply gamma correction
        corrected = np.power(normalized, gamma) * 255
        corrected = np.clip(corrected, 0, 255).astype(np.uint8)  # Ensure values are in range [0, 255]

        return save_and_return_image(corrected)
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Route for Histogram Equalization
@app.route('/apply_histogram', methods=['POST'])
def apply_histogram():
    try:
        image_file = request.files['image']

        # Read image and apply histogram equalization
        image = Image.open(image_file).convert('L')  # Convert to grayscale
        image = np.array(image)
        equalized = cv2.equalizeHist(image)

        return save_and_return_image(equalized)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Route for Laplacian Filtering
@app.route('/apply_laplacian', methods=['POST'])
def apply_laplacian():
    try:
        image_file = request.files['image']

        # Read image and apply Laplacian filter
        image = Image.open(image_file).convert('L')  # Convert to grayscale
        image = np.array(image)
        laplacian = cv2.Laplacian(image, cv2.CV_64F)
        laplacian = cv2.convertScaleAbs(laplacian)

        return save_and_return_image(laplacian)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Route for Sobel Operator
@app.route('/apply_sobel', methods=['POST'])
def apply_sobel():
    try:
        image_file = request.files['image']

        # Read image and apply Sobel operator
        image = Image.open(image_file).convert('L')  # Convert to grayscale
        image = np.array(image)
        sobelx = cv2.Sobel(image, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(image, cv2.CV_64F, 0, 1, ksize=3)
        sobel = cv2.magnitude(sobelx, sobely)
        sobel = cv2.convertScaleAbs(sobel)

        return save_and_return_image(sobel)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Route for Low-Pass Filters (LPIF, LPBF, LPGF)
# Route for Low-Pass Filters (LPIF, LPBF, LPGF)
# @app.route('/apply_lowpass', methods=['POST'])
# def apply_lowpass():
#     try:
#         image_file = request.files['image']
#         filter_type = request.form['filter_type']  # 'ideal', 'butterworth', 'gaussian'
#         cutoff = int(request.form['cutoff'])

#         # Read image
#         image = Image.open(image_file).convert('L')  # Convert to grayscale
#         image = np.array(image, dtype=np.float32)

#         # Prepare for Fourier Transform
#         dft = np.fft.fft2(image)
#         dft_shift = np.fft.fftshift(dft)
#         rows, cols = image.shape
#         crow, ccol = rows // 2, cols // 2

#         # Create filter mask
#         mask = np.zeros((rows, cols), np.float32)
#         for u in range(rows):
#             for v in range(cols):
#                 dist = np.sqrt((u - crow) ** 2 + (v - ccol) ** 2)
#                 if filter_type == 'ideal':
#                     mask[u, v] = 1 if dist <= cutoff else 0
#                 elif filter_type == 'butterworth':
#                     mask[u, v] = 1 / (1 + (dist / cutoff) ** 2)
#                 elif filter_type == 'gaussian':
#                     mask[u, v] = np.exp(-(dist ** 2) / (2 * (cutoff ** 2)))

#         # Apply filter and inverse DFT
#         filtered_dft = dft_shift * mask
#         dft_ishift = np.fft.ifftshift(filtered_dft)
#         filtered_image = np.abs(np.fft.ifft2(dft_ishift))
#         filtered_image = np.clip(filtered_image, 0, 255).astype(np.uint8)

#         return save_and_return_image(filtered_image)
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400


# # Route for High-Pass Filters (HPIF, HPBF, HPGF)
# @app.route('/apply_highpass', methods=['POST'])
# def apply_highpass():
#     try:
#         image_file = request.files['image']
#         filter_type = request.form['filter_type']  # 'ideal', 'butterworth', 'gaussian'
#         cutoff = int(request.form['cutoff'])

#         # Read image
#         image = Image.open(image_file).convert('L')  # Convert to grayscale
#         image = np.array(image, dtype=np.float32)

#         # Prepare for Fourier Transform
#         dft = np.fft.fft2(image)
#         dft_shift = np.fft.fftshift(dft)
#         rows, cols = image.shape
#         crow, ccol = rows // 2, cols // 2

#         # Create filter mask
#         mask = np.ones((rows, cols), np.float32)
#         for u in range(rows):
#             for v in range(cols):
#                 dist = np.sqrt((u - crow) ** 2 + (v - ccol) ** 2)
#                 if filter_type == 'ideal':
#                     mask[u, v] = 0 if dist <= cutoff else 1
#                 elif filter_type == 'butterworth':
#                     mask[u, v] = 1 / (1 + (cutoff / dist) ** (2 * 2)) if dist != 0 else 0
#                 elif filter_type == 'gaussian':
#                     mask[u, v] = 1 - np.exp(-(dist ** 2) / (2 * (cutoff ** 2)))

#         # Apply filter and inverse DFT
#         filtered_dft = dft_shift * mask
#         dft_ishift = np.fft.ifftshift(filtered_dft)
#         filtered_image = np.abs(np.fft.ifft2(dft_ishift))
#         filtered_image = np.clip(filtered_image, 0, 255).astype(np.uint8)

#         return save_and_return_image(filtered_image)
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400

@app.route('/apply_lowpass', methods=['POST'])
def apply_lowpass():
    try:
        image_file = request.files['image']
        filter_type = request.form['filter_type']  # 'ideal', 'butterworth', 'gaussian'
        cutoff = int(request.form['cutoff'])

        # Read image
        image = Image.open(image_file).convert('L')  # Convert to grayscale
        image = np.array(image, dtype=np.float32)

        # Prepare for Fourier Transform
        dft = np.fft.fft2(image)
        dft_shift = np.fft.fftshift(dft)
        rows, cols = image.shape
        crow, ccol = rows // 2, cols // 2

        # Create filter mask
        mask = np.zeros((rows, cols), np.float32)
        for u in range(rows):
            for v in range(cols):
                dist = np.sqrt((u - crow) ** 2 + (v - ccol) ** 2)
                if filter_type == 'ideal':
                    mask[u, v] = 1 if dist <= cutoff else 0
                elif filter_type == 'butterworth':
                    mask[u, v] = 1 / (1 + (dist / cutoff) ** 2)
                elif filter_type == 'gaussian':
                    mask[u, v] = np.exp(-(dist ** 2) / (2 * (cutoff ** 2)))

        # Apply filter and inverse DFT
        filtered_dft = dft_shift * mask
        dft_ishift = np.fft.ifftshift(filtered_dft)
        filtered_image = np.abs(np.fft.ifft2(dft_ishift))
        filtered_image = np.clip(filtered_image, 0, 255).astype(np.uint8)

        return save_and_return_image(filtered_image)
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Route for High-Pass Filters (HPIF, HPBF, HPGF)
@app.route('/apply_highpass', methods=['POST'])
def apply_highpass():
    try:
        image_file = request.files['image']
        filter_type = request.form['filter_type']  # 'ideal', 'butterworth', 'gaussian'
        cutoff = int(request.form['cutoff'])

        # Read image
        image = Image.open(image_file).convert('L')  # Convert to grayscale
        image = np.array(image, dtype=np.float32)

        # Prepare for Fourier Transform
        dft = np.fft.fft2(image)
        dft_shift = np.fft.fftshift(dft)
        rows, cols = image.shape
        crow, ccol = rows // 2, cols // 2

        # Create filter mask
        mask = np.ones((rows, cols), np.float32)
        for u in range(rows):
            for v in range(cols):
                dist = np.sqrt((u - crow) ** 2 + (v - ccol) ** 2)
                if filter_type == 'ideal':
                    mask[u, v] = 0 if dist <= cutoff else 1
                elif filter_type == 'butterworth':
                    mask[u, v] = 1 / (1 + (cutoff / dist) ** 4) if dist != 0 else 0  # Avoid division by zero
                elif filter_type == 'gaussian':
                    mask[u, v] = 1 - np.exp(-(dist ** 2) / (2 * (cutoff ** 2)))

        # Apply filter and inverse DFT
        filtered_dft = dft_shift * mask
        dft_ishift = np.fft.ifftshift(filtered_dft)
        filtered_image = np.abs(np.fft.ifft2(dft_ishift))
        filtered_image = np.clip(filtered_image, 0, 255).astype(np.uint8)

        return save_and_return_image(filtered_image)
    except Exception as e:
        return jsonify({'error': str(e)}), 400



if __name__ == '__main__':
    app.run(debug=True)
 