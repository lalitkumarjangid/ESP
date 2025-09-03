const { MongoClient } = require('mongodb');

async function cleanDatabase() {
  const uri = 'mongodb+srv://lalitkumar:Lalit%40mongo1@cluster0.ngcruti.mongodb.net/email-analysis';
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔌 Connected to MongoDB');
    
    const db = client.db('email-analysis');
    const collection = db.collection('emails');
    
    // Get all emails first
    const allEmails = await collection.find({}).toArray();
    console.log(`📧 Total emails found: ${allEmails.length}`);
    
    // Identify test/demo emails to remove
    const testEmails = allEmails.filter(email => 
      email.subject?.includes('TEST') || 
      email.subject?.includes('Demo') || 
      email.subject?.includes('DEMO') ||
      email.subject === 'No' ||
      email.analysis?.isDemo === true ||
      email.metadata?.isDemo === true
    );
    
    console.log(`🗑️  Test/Demo emails to remove: ${testEmails.length}`);
    testEmails.forEach(email => {
      console.log(`   - ${email.subject} (${email._id})`);
    });
    
    if (testEmails.length > 0) {
      const testIds = testEmails.map(email => email._id);
      const deleteResult = await collection.deleteMany({ _id: { $in: testIds } });
      console.log(`✅ Deleted ${deleteResult.deletedCount} test/demo emails`);
    }
    
    // Show remaining emails
    const remainingEmails = await collection.find({}).toArray();
    console.log(`\n📊 Remaining emails: ${remainingEmails.length}`);
    remainingEmails.forEach(email => {
      console.log(`   ✓ ${email.subject} (${email.analysis?.esp || 'Unknown ESP'})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

cleanDatabase();
