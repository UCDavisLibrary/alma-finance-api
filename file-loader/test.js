const {fetchAllUsers} = require('./controllers/dbcalls');

getUserEmails = async () => {
    try {
      const users = await fetchAllUsers();
      let emails = [];
      users.forEach(user => {
        emails.push(user.email);
      });
      logMessage('INFO',`getUserEmails: ${emails}`);
      return emails;
    }
    catch (error) {
      logMessage('DEBUG',error);
    }
  }

getUserEmails();