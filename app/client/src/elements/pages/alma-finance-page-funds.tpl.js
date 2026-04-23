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
              <th>Fund Code</th>
              <th>Name</th>
              <th>Library</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.funds.map(fund => html`
              <tr>
                <td>${fund.fundcode || fund.fund_code || '—'}</td>
                <td>${fund.name || '—'}</td>
                <td>${fund.library || '—'}</td>
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
