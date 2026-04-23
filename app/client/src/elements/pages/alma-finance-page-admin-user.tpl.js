import { html } from 'lit';

export function render() {
  if (this.loading) return html`<div class="l-container u-space-my"><p>Loading user...</p></div>`;
  if (this.error && !this.user) return html`<div class="l-container u-space-my"><p class="color-secondary">${this.error}</p><a href="/admin/users">← Back</a></div>`;

  return html`
    <div class="l-container u-space-my">
      <a href="/admin/users" style="display:inline-block;" class="u-space-mb">← Back to Users</a>
      <h1 class="heading--highlight">Edit User</h1>

      ${this.success ? html`<p class="color-gold u-space-mt">User updated successfully.</p>` : ''}
      ${this.error ? html`<p class="color-secondary u-space-mt">Error: ${this.error}</p>` : ''}

      ${this.user ? html`
        <form @submit=${e => { e.preventDefault(); this._save(); }} class="u-space-mt">
          <div class="field-container">
            <label>First Name</label>
            <input class="form-input" type="text" .value=${this.form.firstname || ''}
              @input=${e => this._updateField('firstname', e.target.value)}>
          </div>
          <div class="field-container">
            <label>Last Name</label>
            <input class="form-input" type="text" .value=${this.form.lastname || ''}
              @input=${e => this._updateField('lastname', e.target.value)}>
          </div>
          <div class="field-container">
            <label>Email</label>
            <input class="form-input" type="email" .value=${this.form.email || ''}
              @input=${e => this._updateField('email', e.target.value)}>
          </div>
          <div class="field-container">
            <label>Kerberos ID</label>
            <input class="form-input" type="text" .value=${this.form.kerberos || ''}
              @input=${e => this._updateField('kerberos', e.target.value)}>
          </div>
          <div class="field-container">
            <label>Library</label>
            <input class="form-input" type="text" .value=${this.form.library || ''}
              @input=${e => this._updateField('library', e.target.value)}>
          </div>
          <div class="u-space-mt">
            <button type="submit" class="btn btn--primary" ?disabled=${this.saving}>
              ${this.saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ` : ''}
    </div>
  `;
}
