import { html } from 'lit';

export function render() {
  if (this.loading) return html`<div class="l-container u-space-my"><p>Loading users...</p></div>`;

  return html`
    <div class="l-container u-space-my">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h1 class="heading--highlight">Users</h1>
        <a href="/admin/users/new" class="btn btn--primary btn--sm">+ Add User</a>
      </div>

      ${this.error ? html`<p class="color-secondary">Error: ${this.error}</p>` : ''}

      ${!this.users.length ? html`<p>No users found.</p>` : html`
        <table class="table--striped u-space-mt">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Kerberos</th>
              <th>Library</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.users.map(user => html`
              <tr>
                <td>${user.firstname} ${user.lastname}</td>
                <td>${user.email}</td>
                <td>${user.kerberos}</td>
                <td>${user.library}</td>
                <td>
                  <a href="/admin/users/${user.id}" class="btn btn--alt2 btn--sm">Edit</a>
                  <button class="btn btn--alt btn--sm u-space-ml" @click=${() => this._deleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      `}
    </div>
  `;
}
