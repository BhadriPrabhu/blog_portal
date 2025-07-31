// const mongoose = require('mongoose');
// const Blog = require('./models/blogSchema');

// const uri = "mongodb+srv://bhadriprabhu:bhadri%402006@bhadri.osdxvju.mongodb.net/blog_portal?retryWrites=true&w=majority&appName=bhadri";

// async function updateTestData() {
//   try {
//     await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       connectTimeoutMS: 30000,
//       serverSelectionTimeoutMS: 30000,
//     });
//     console.log('Connected to MongoDB');

//     // Update existing documents to include savedBy
//     const result = await Blog.updateMany(
//       { savedBy: { $exists: false } },
//       { $set: { savedBy: [] } }
//     );
//     console.log(`Updated ${result.modifiedCount} blog documents with savedBy field`);

//     // Optional: Insert sample data for testing
//     const sampleBlogs = [
//       {
//         user: new mongoose.Types.ObjectId(), // Replace with valid auth user ID
//         email: 'user1@example.com',
//         title: 'Sample Post 1',
//         desc: 'This is a sample post description',
//         date: new Date(),
//         like: 5,
//         likedBy: ['user1@example.com'],
//         savedBy: ['user1@example.com'],
//         comments: [
//           {
//             user: new mongoose.Types.ObjectId(), // Replace with valid auth user ID
//             value: 'Great post!',
//             status: 'approved',
//           },
//         ],
//         status: 'active',
//       },
//       {
//         user: new mongoose.Types.ObjectId(), // Replace with valid auth user ID
//         email: 'user2@example.com',
//         title: 'Sample Post 2',
//         desc: 'Another sample post description',
//         date: new Date(),
//         like: 3,
//         likedBy: [],
//         savedBy: [],
//         comments: [],
//         status: 'active',
//       },
//     ];

//     // Uncomment to insert sample data
//     // const inserted = await Blog.insertMany(sampleBlogs);
//     // console.log(`Inserted ${inserted.length} sample blog documents`);

//     // Log all blog documents
//     const blogs = await Blog.find({}).lean();
//     console.log(`Total documents: ${blogs.length}`);
//     blogs.forEach(blog => {
//       console.log(`Blog ID: ${blog._id}, Status: ${blog.status}, User: ${blog.user}, SavedBy: ${JSON.stringify(blog.savedBy)}`);
//       if (blog.comments && blog.comments.length > 0) {
//         blog.comments.forEach((comment, index) => {
//           console.log(`  Comment ${index + 1} ID: ${comment._id}, Status: ${comment.status}, User: ${comment.user}`);
//           if (comment.reply && comment.reply.length > 0) {
//             comment.reply.forEach((reply, rIndex) => {
//               console.log(`    Reply ${rIndex + 1} User: ${reply.user}, Value: ${reply.value}`);
//             });
//           }
//         });
//       }
//     });

//     await mongoose.disconnect();
//     console.log('Disconnected from MongoDB');
//   } catch (err) {
//     console.error('Test data update error:', {
//       message: err.message,
//       stack: err.stack,
//       timestamp: new Date().toISOString(),
//     });
//   }
// }

// updateTestData();

const mongoose = require('mongoose');
const Blog = require('./models/blogSchema.js'); // Adjust path to your blogSchema.js

// Connect to MongoDB
mongoose.connect("mongodb+srv://bhadriprabhu:bhadri%402006@bhadri.osdxvju.mongodb.net/blog_portal?retryWrites=true&w=majority&appName=bhadri", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB for migration'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample test data with tags
const sampleBlogs = [
  {
    _id: new mongoose.Types.ObjectId('68861f406d37a9fac189849f'),
    user: new mongoose.Types.ObjectId(), // Replace with valid auth _id if needed
    email: 'rahul@gmail.com',
    title: 'Sample Blog Post 1',
    desc: 'This is a sample blog post for testing the portal.',
    date: new Date(),
    like: 2,
    likedBy: ['rahul@gmail.com', 'lakshen@gmail.com'],
    savedBy: ['rahul@gmail.com'],
    tags: ['tech', 'programming', 'javascript'],
    comments: [],
    status: 'active',
  },
  {
    user: new mongoose.Types.ObjectId(),
    email: 'lakshen@gmail.com',
    title: 'Sample Blog Post 2',
    desc: 'Another test post to explore the blog portal features.',
    date: new Date(),
    like: 1,
    likedBy: ['rahul@gmail.com'],
    savedBy: [],
    tags: ['webdev', 'react', 'coding'],
    comments: [
      {
        user: new mongoose.Types.ObjectId(),
        value: 'Great post!',
        status: 'approved',
      },
    ],
    status: 'active',
  },
  {
    user: new mongoose.Types.ObjectId(),
    email: 'testuser@gmail.com',
    title: 'Sample Blog Post 3',
    desc: 'A third test post with different tags.',
    date: new Date(),
    like: 0,
    likedBy: [],
    savedBy: [],
    tags: ['mongodb', 'nodejs', 'backend'],
    comments: [],
    status: 'active',
  },
];

// Migration function
async function migrate() {
  try {
    // Update existing documents to add tags field if missing
    const updateResult = await Blog.updateMany(
      { tags: { $exists: false } },
      { $set: { tags: [] } } // Set empty tags array for existing documents without tags
    );
    console.log(`Updated ${updateResult.modifiedCount} documents to include tags field`);

    // Update specific document with tags
    await Blog.updateOne(
      { _id: new mongoose.Types.ObjectId('68861f406d37a9fac189849f') },
      {
        $set: {
          tags: ['tech', 'programming', 'javascript'],
          likedBy: ['rahul@gmail.com', 'lakshen@gmail.com'],
          savedBy: ['rahul@gmail.com'],
          like: 2,
        },
        $unset: { liked: "", saved: "" }, // Remove deprecated fields
      },
      { upsert: true }
    );
    console.log('Updated or inserted document with _id: 68861f406d37a9fac189849f');

    // Insert or update sample blogs
    for (const blog of sampleBlogs) {
      await Blog.updateOne(
        { _id: blog._id || new mongoose.Types.ObjectId() },
        { $set: blog },
        { upsert: true }
      );
      console.log(`Inserted/updated blog: ${blog.title}`);
    }

    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration error:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run migration
migrate();