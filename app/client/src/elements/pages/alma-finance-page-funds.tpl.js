import { html } from 'lit';

export function render() {
  if (this.loading) return html`<div class="l-container u-space-my"><p>Loading funds...</p></div>`;

  return html`
    <div class="l-container u-space-my">
      <h1 class="heading--highlight">Funds</h1>

      ${this.error ? html`<p class="color-secondary">Error: ${this.error}</p>` : ''}

      ${!this.funds.length ? html`<p>No funds found.</p>` : html`
        <table class="table--striped u-space-mt">
          <thead>
              <tr>
                <th>ID</th>
                <th>Fund ID</th>
                <th>Fund Code</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody>
            ${this.funds.map(fund => html`
              <tr>
                <td>${fund.id || '—'}</td>
                <td>${fund.fundId || '—'}</td>
                <td>${fund.fundCode || '—'}</td>
                <td>
                  <button class="btn btn--alt btn--sm" @click=${() => this._deleteFund(fund.id)}>Delete</button>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      `}
    </div>
  `;
}
