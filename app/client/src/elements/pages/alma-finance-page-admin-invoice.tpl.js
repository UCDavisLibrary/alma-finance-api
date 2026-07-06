import { html } from 'lit';

export function render() {
  if (this.loading) return html`<div class="l-container u-space-my"><p>Loading invoice...</p></div>`;
  if (this.error && !this.invoice) return html`<div class="l-container u-space-my"><p class="color-secondary">${this.error}</p><a href="/admin/invoices">← Back</a></div>`;

  return html`
    <div class="l-container u-space-my">
      <a href="/admin/invoices" style="display:inline-block;" class="u-space-mb">← Back to All Invoices</a>
      <h1 class="heading--highlight">Edit Invoice</h1>

      ${this.success ? html`<p class="color-gold u-space-mt">Invoice updated successfully.</p>` : ''}
      ${this.error ? html`<p class="color-secondary u-space-mt">Error: ${this.error}</p>` : ''}

      ${this.invoice ? html`
        <form @submit=${e => { e.preventDefault(); this._save(); }} class="u-space-mt">
          <div class="field-container">
            <label>Invoice Number</label>
            <input class="form-input" type="text" .value=${this.form.invoicenumber || ''}
              @input=${e => this._updateField('invoicenumber', e.target.value)}>
          </div>
          <div class="field-container">
            <label>Invoice ID</label>
            <input class="form-input" type="text" .value=${this.form.invoiceid || ''}
              @input=${e => this._updateField('invoiceid', e.target.value)}>
          </div>
          <div class="field-container">
            <label>Consumer Tracking ID</label>
            <input class="form-input" type="text" .value=${this.form.consumertrackingid || ''}
              @input=${e => this._updateField('consumerTrackingId', e.target.value)}>
          </div>
          <div class="field-container">
            <label>Status</label>
            <select class="form-input" @change=${e => this._updateField('status', e.target.value)}>
              <option value="PENDING" ?selected=${this.form.status === 'PENDING'}>PENDING</option>
              <option value="PAID" ?selected=${this.form.status === 'PAID'}>PAID</option>
              <option value="ERROR" ?selected=${this.form.status === 'ERROR'}>ERROR</option>
            </select>
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
