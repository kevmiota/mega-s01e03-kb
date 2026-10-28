<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { causeOf, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  // One row per problem in a merged ticket. causes.ts places a report by its tenant; the reports
  // the desk read as a one-day move (desk-notes.json) are no day/month swap, so they get a row of
  // their own here instead of a footnote under `parser`.
  type Problem = 'parser' | 'hint' | 'move' | 'unplaced';
  let { ticket, issues }: { ticket: number; issues: Partial<Record<Problem, string>> } = $props();

  const LABEL: Record<Problem, string> = {
    parser: 'shared parser reads day-first dates month first',
    hint: 'booking-v3 hint asks day-first tenants for MM/DD/YYYY',
    move: 'booking moves by one day',
    unplaced: 'no tenant on file or not day-first',
  };

  const problemOf = (r: Report): Problem =>
    notes.oneDayMove.includes(r.id) ? 'move' : (causeOf(r, tenantOf(r)) ?? 'unplaced');

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const rows = $derived.by(() => {
    const by = new Map<Problem, Report[]>();
    for (const r of merged) by.set(problemOf(r), [...(by.get(problemOf(r)) ?? []), r]);
    return [...by.entries()]
      .map(([problem, rs]) => {
        const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
        return {
          problem,
          reports: rs.length,
          tenants: new Set(rs.map((r) => r.tenant)).size,
          channels: [...new Set(rs.map((r) => r.channel))].sort().join(' · '),
          seen: `${days[0]} → ${days[days.length - 1]}`,
        };
      })
      .sort((a, b) => b.reports - a.reports);
  });
  const ticketLabel = (url: string) => url.replace(/^https:\/\/github\.com\//, '').replace('/issues/', '#');
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{rows.length}</strong>
  {rows.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>channels</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each rows as row (row.problem)}
      <tr>
        <td><code>{row.problem}</code> {LABEL[row.problem]}</td>
        <td>{row.reports}</td>
        <td>{row.tenants}</td>
        <td>{row.channels}</td>
        <td>{row.seen}</td>
        <td>
          {#if issues[row.problem]}<a href={issues[row.problem]}>{ticketLabel(issues[row.problem] ?? '')}</a>{:else}<span class="none">none yet</span>{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .none { color: var(--warn); font-weight: 600; }
</style>
