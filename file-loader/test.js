const {updateStatus, getAllUnpaidInvoices, fetchAllUsers} = require('./controllers/dbcalls');

getUserEmails = async () => {
    try {
      const users = await fetchAllUsers();
      let emails = [];
      users.forEach(user => {
        emails.push(user.email);
      });
      console.log(emails);
      return emails;
    }
    catch (error) {
      console.log(error);
    }
  }

getUserEmails();