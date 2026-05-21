import { html } from 'lit';

export function render() {
  return html`
    <div class="l-container u-space-my">
      <a href="/admin/users" style="display:inline-block;" class="u-space-mb">← Back to Users</a>
      <h1 class="heading--highlight">Add New User</h1>

      ${this.success ? html`
        <div class="brand-textbox u-space-my">
          <p>User added successfully.</p>
          <a href="/admin/users">View all users</a> or add another below.
        </div>
      ` : ''}
      ${this.error ? html`<p class="color-secondary">Error: ${this.error}</p>` : ''}

      <form @submit=${e => { e.preventDefault(); this._submit(); }} class="u-space-mt">
        <div class="field-container">
          <label>First Name *</label>
          <input class="form-input" type="text" required .value=${this.form.firstname}
            @input=${e => this._updateField('firstname', e.target.value)}>
        </div>
        <div class="field-container">
          <label>Last Name *</label>
          <input class="form-input" type="text" required .value=${this.form.lastname}
            @input=${e => this._updateField('lastname', e.target.value)}>
        </div>
        <div class="field-container">
          <label>Email *</label>
          <input class="form-input" type="email" required pattern="^[^@]+@ucdavis\\.edu$"
            title="Email must end in @ucdavis.edu" .value=${this.form.email}
            @input=${e => this._updateField('email', e.target.value)}>
        </div>
        <div class="field-container">
          <label>Kerberos ID *</label>
          <input class="form-input" type="text" required .value=${this.form.kerberos}
            @input=${e => this._updateField('kerberos', e.target.value)}>
        </div>
        <div class="field-container">
          <label>Library *</label>
          <select class="form-input" required .value=${this.form.library}
            @change=${e => this._updateField('library', e.target.value)}>
            <option value="SHLDS">SHLDS</option>
            <option value="LAW">LAW</option>
          </select>
        </div>
        <div class="u-space-mt">
          <button type="submit" class="btn btn--primary" ?disabled=${this.saving}>
            ${this.saving ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  `;
}
