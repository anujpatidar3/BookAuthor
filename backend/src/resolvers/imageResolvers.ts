import { uploadImageToCloudinary } from '../utils/imageUpload';

export const imageResolvers = {
  Mutation: {
    uploadImage: async (_: any, { file, type = 'general' }: { file: any, type?: string }) => {
      try {
        const { createReadStream, filename, mimetype } = await file;
        
        // Validate file type
        if (!mimetype.startsWith('image/')) {
          throw new Error('File must be an image');
        }

        // Read the file into a buffer
        const stream = createReadStream();
        const chunks: Buffer[] = [];
        
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        
        const buffer = Buffer.concat(chunks);
        
        // Validate file size (5MB max)
        if (buffer.length > 5 * 1024 * 1024) {
          throw new Error('File size must be less than 5MB');
        }

        // Determine folder based on type
        let folder = 'bookauthor';
        if (type === 'author') {
          folder = 'bookauthor/authors';
        } else if (type === 'book') {
          folder = 'bookauthor/books';
        }

        // Upload to Cloudinary
        const result = await uploadImageToCloudinary(buffer, folder);
        
        return {
          url: result.secure_url,
          publicId: result.public_id
        };
      } catch (error) {
        console.error('Image upload error:', error);
        throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
};
