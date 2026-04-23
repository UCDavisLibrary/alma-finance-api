import { html } from 'lit';

export function render() {
  return html`
    <div class="l-container u-space-my">
      <h1 class="heading--highlight">Administration</h1>
      <div class="l-2col u-space-mt">
        <div class="l-first">
          <div class="category-brand--secondary u-space-mb">
            <h2>Invoices</h2>
            <ul class="list--arrow">
              <li><a href="/admin/invoices">View All Invoices</a></li>
            </ul>
          </div>
        </div>
        <div class="l-second">
          <div class="category-brand--secondary u-space-mb">
            <h2>Users</h2>
            <ul class="list--arrow">
              <li><a href="/admin/users">View All Users</a></li>
              <li><a href="/admin/users/new">Add New User</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}
