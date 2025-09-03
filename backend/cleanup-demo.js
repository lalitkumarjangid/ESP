// Clean up demo data - keep only real email data
const { MongoClient } = require('mongodb');

async function cleanupDemo() {
  const client = new MongoClient('mongodb+srv://lalitkumar:Lalit%40mongo1@cluster0.ngcruti.mongodb.net/email-analysis');
  
  try {
    await client.connect();
    const db = client.db('email-analysis');
    const collection = db.collection('emails');
    
    // Delete demo emails (ones with demo.sender@gmail.com or generated demo data)
    const result = await collection.deleteMany({
      $or: [
        { senderEmail: 'demo.sender@gmail.com' },
        { senderEmail: /demo/i },
        { subject: /demo/i }
      ]
    });
    
    console.log(`🗑️ Deleted ${result.deletedCount} demo emails`);
    
    // Show remaining emails
    const remaining = await collection.find({}).toArray();
    console.log(`📧 Remaining emails: ${remaining.length}`);
    remaining.forEach((email, i) => {
      console.log(`${i+1}. ${email.subject} (${email.espType}) - ${email.senderEmail}`);
    });
    
  } finally {
    await client.close();
  }
}

cleanupDemo().catch(console.error);
