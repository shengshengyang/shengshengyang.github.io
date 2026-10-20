/* 在 Fluid 導覽列加入「刷題」下拉選單，只列出實際有文章的 tag。
 * 選單項目在 source/_data/fluid_config.yml 的 leetcode_menu 設定，不需要改主題檔。
 */
hexo.extend.filter.register('before_generate', function () {
  const conf = hexo.theme.config.leetcode_menu;
  const navbar = hexo.theme.config && hexo.theme.config.navbar;
  if (!conf || !conf.enable || !navbar || !Array.isArray(navbar.menu)) return;

  const tagModel = hexo.model('Tag');
  const submenu = [];
  for (const item of conf.items || []) {
    const tag = tagModel.findOne({ name: item.tag });
    if (!tag || !tag.length) continue; // 沒有文章就不列出
    submenu.push({ key: item.tag, name: item.name || item.tag, link: '/' + tag.path });
  }

  // 重新產生時（hexo server）先移除舊的，避免重複
  navbar.menu = navbar.menu.filter(m => m.key !== 'leetcode');
  if (!submenu.length) return;

  const entry = { key: 'leetcode', name: conf.name || '刷題', icon: conf.icon, submenu };
  const at = navbar.menu.findIndex(m => m.key === (conf.after || 'tag'));
  navbar.menu.splice(at < 0 ? navbar.menu.length : at + 1, 0, entry);
});
