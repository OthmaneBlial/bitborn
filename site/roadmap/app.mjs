const status = document.getElementById('roadmap-status');
try {
  const response = await fetch(new URL('../progress.json',import.meta.url));
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const progress = await response.json();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(progress.updated) || !Array.isArray(progress.milestones) || progress.milestones.length > 100 || progress.milestones.some(item => typeof item.milestone !== 'string' || typeof item.progress !== 'string' || item.milestone.length > 2000 || item.progress.length > 2000)) throw new Error('The progress data has an invalid shape.');
  document.getElementById('roadmap-updated').textContent = `UPDATED ${progress.updated}`;
  const list = document.getElementById('milestone-list');
  progress.milestones.forEach((milestone,index) => {
    const item = document.createElement('li');item.className = 'milestone-row';
    const number = document.createElement('span');number.className = 'route-number';number.textContent = String(index + 1).padStart(2,'0');
    const title = document.createElement('h3');title.textContent = milestone.milestone;
    const detail = document.createElement('p');detail.className = `milestone-progress${milestone.progress.startsWith('✅') ? ' complete' : ''}`;detail.textContent = milestone.progress;
    item.append(number,title,detail);list.append(item);
  });
  status.textContent = `${progress.milestones.length} milestones from ROADMAP.md. The README keeps a short summary; this page shows the detailed evidence and remaining work.`;
} catch (error) {
  status.textContent = `Progress is unavailable: ${error.message} Read the linked ROADMAP.md for the source record.`;status.classList.add('error');
}
