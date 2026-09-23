(() => {
  const input = document.getElementById('game-search');
  const result = document.getElementById('game-result');
  const groups = Array.from(document.querySelectorAll('.game-category'));
  if (!input) return;
  let previousOpen = null;
  input.addEventListener('input', () => {
    const term = input.value.trim().toLocaleLowerCase();
    if (term && previousOpen === null) previousOpen = groups.map(g => g.open);
    let count = 0;
    groups.forEach((group, index) => {
      const items = Array.from(group.querySelectorAll('li'));
      let matches = 0;
      items.forEach(item => {
        item.hidden = !!term && !item.textContent.toLocaleLowerCase().includes(term);
        if (!item.hidden) matches++;
      });
      count += matches;
      group.hidden = !!term && matches === 0;
      if (term) group.open = matches > 0;
      else if (previousOpen) group.open = previousOpen[index];
      group.querySelector('summary span').textContent = term ? `${matches}项匹配` : `${items.length}项`;
    });
    if (!term) previousOpen = null;
    result.textContent = term ? (count ? `找到 ${count} 项匹配玩法` : '所列部分名单中没有匹配项，可换个关键词或联系咨询完整清单。') : '按类别展开查看中文名单';
  });
})();
