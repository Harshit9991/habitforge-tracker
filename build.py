#!/usr/bin/env python3
"""Rewrite the Stitch export into HabitForge pages. Design markup is preserved; data regions become mount points."""
import re, sys, os
SRC = 'src/stitch/'
def rd(n):
    s = open(SRC + n + '/code.html', encoding='utf-8').read()
    return re.sub(r'\n\s*', '', s)
def sub(h, old, new, n=1):
    c = h.count(old)
    if c != n: raise SystemExit('expected %d got %d for: %s' % (n, c, old[:90]))
    return h.replace(old, new)
def region(h, start, end, new):
    i = h.find(start); j = h.find(end, i + 1)
    if i < 0 or j < 0: raise SystemExit('region not found: %s .. %s' % (start[:50], end[:50]))
    return h[:i] + new + h[j:]
def empty_inner(h, open_re, ins_id, tag='div', extra=''):
    m = re.search(open_re, h)
    if not m: raise SystemExit('no match ' + open_re)
    op = m.group(0); i = m.end(); depth = 1
    pat = re.compile(r'<(/?)' + tag + r'\b[^>]*>')
    for mm in pat.finditer(h, i):
        depth += -1 if mm.group(1) else 1
        if depth == 0: break
    newop = op[:-1] + ' id="%s"%s>' % (ins_id, extra)
    return h[:m.start()] + newop + h[mm.start():]
def strip_scripts(h):
    return re.sub(r'<script>.*?</script>', '', h, flags=re.S)
def common(h, view, page, desc):
    h = h.replace('<html', '<html data-view="%s"' % view, 1) if 'data-view' not in h else h
    h = re.sub(r'<title>.*?</title>', '<title>HabitForge - %s</title>' % page, h)
    if '<title>' not in h: h = h.replace('</head>', '<title>HabitForge - %s</title></head>' % page)
    h = h.replace('</head>', '<meta name="description" content="%s"><meta name="theme-color" content="#111319"><link rel="icon" href="%sassets/favicon.svg"></head>' % (desc, '../' if view == 'mobile' else ''), 1)
    h = h.replace('THE WYNTER ARC PROTOCOL • TEMPERED STEEL • 90-DAY GAUNTLET', 'HABITFORGE PROTOCOL • TEMPERED STEEL • 90-DAY GAUNTLET')
    h = re.sub(r'© 20\d\d MASTERY DIVISION\. DISCIPLINE OVER MOTIVATION\.', '© <span id="hf-year-now">2026</span> HABITFORGE. DISCIPLINE OVER MOTIVATION.', h)
    h = h.replace('THE WYNTER ARC', 'HABITFORGE').replace('The Wynter Arc', 'HabitForge')
    # nav
    h = h.replace('data-path="dashboard" href="#"', 'data-path="dashboard" href="index.html"').replace('data-path="daily-tracker" href="#"', 'data-path="daily-tracker" href="tracker.html"')
    return h
def finish(h, view, scripts):
    pre0 = '../' if view == 'mobile' else ''
    h = re.sub(r'src="https://lh3\.googleusercontent\.com/[^"]*"', 'src="%sassets/forge.jpg"' % pre0, h)
    pre = '../' if view == 'mobile' else ''
    s = ''.join('<script src="%sassets/%s"></script>' % (pre, x) for x in scripts)
    return h.replace('</body>', s + '</body>')
FONT_SAFE = ''

def tracker_desktop():
    h = rd('daily_tracker_the_wynter_arc_desktop'); old = rd('daily_tracker_the_wynter_arc')
    h = strip_scripts(h)
    h = common(h, 'desktop', 'Daily Tracker', 'HabitForge - forge new habits over a 3-month campaign.')
    # header pills
    h = re.sub(r'(<div class="hidden lg:flex items-center bg-surface-container-low border border-outline-variant/50 rounded p-\[2px\]">).*?(</div><div class="hidden sm:flex)',
               r'\1<span id="hf-year" class="contents"></span><div class="h-3 w-[1px] bg-outline-variant/40 mx-1"></div><span id="hf-month" class="contents"></span>\2', h, count=1, flags=re.S)
    h = sub(h, 'Synced to Supabase</span><span class="font-label-sm text-[10px] text-outline">42ms</span>', 'Saved locally</span>') if 'text-outline">42ms' in h else h
    h = h.replace('Synced to Supabase', 'Saved locally')
    h = re.sub(r'<span class="[^"]*">42ms</span>', '', h)
    h = sub(h, '<button aria-label="Settings"', '<button id="gear-btn" aria-label="Settings"')
    h = re.sub(r'Historical Ledger Mode • Viewing Nov 14, 2024 • Edits auto-save to Supabase \(Row #104\)', '<span id="ledger-notice">Live Ledger Mode</span>', h)
    h = sub(h, 'Target Threshold: 75%', '<span id="threshold-chip">Target Threshold: 75%</span>')
    h = re.sub(r'(<div class="flex items-center gap-space-xs">)(<button[^>]*type="button">Nov 11</button>.*?)(</div></div><div class="flex items-center gap-space-xs"><input class=")', r'<div id="tray-days" class="flex items-center gap-space-xs"></div>\3', h, count=1, flags=re.S)
    h = sub(h, '<input class="bg-surface-container-lowest text-on-surface font-label-sm text-label-sm px-space-sm py-space-xs rounded outline-none shadow-inner" type="date" value="2024-11-14">', '<input id="jump-date" aria-label="Jump to date" class="bg-surface-container-lowest text-on-surface font-label-sm text-label-sm px-space-sm py-space-xs rounded outline-none shadow-inner" type="date">')
    h = sub(h, 'hover:bg-surface-container-highest" type="button">Load</button>', 'hover:bg-surface-container-highest" id="load-date-btn" type="button">Load</button>')
    h = sub(h, 'Thursday • Nov 14, 2024', '<span id="day-label">Today</span>')
    h = sub(h, '+1 Day toward 18-day streak', '<span id="streak-note"></span>')
    h = sub(h, 'Target: 75%</span>', '<span id="target-chip">Target: 75%</span></span>') if False else h
    h = re.sub(r'(>)Target: 75%(</span>)', r'\1<span id="target-chip">Target: 75%</span>\2', h, count=1)
    h = sub(h, '/ 11 Complete', '<span id="strike-total">/ 11 Complete</span>')
    h = sub(h, 'Thresholds &amp; Supabase', 'Thresholds &amp; Storage')
    h = sub(h, 'Requires 8 of 11 habits to forge a tempered strike day.', '<span id="threshold-hint"></span>')
    # modal body: streak grace + db binding -> truthful blocks
    m = re.search(r'<div[^>]*><div[^>]*><span[^>]*>Streak Grace Margin</span>.*?<code[^>]*>public\.wynter_daily_habits</code></span></div>', h, re.S)
    assert m, 'modal blocks'
    blk = m.group(0)
    grace_i = blk.find('Streak Grace Margin'); db_i = blk.find('Database Binding')
    # keep wrapper classes of each block by locating the two block openers
    openers = [mm.start() for mm in re.finditer(r'<div class="[^"]*">(?=<div class="[^"]*"><span class="[^"]*">(Streak Grace Margin|Database Binding))', blk)]
    wrap = re.match(r'<div class="[^"]*">', blk).group(0)
    new_blocks = (wrap + '<div class="flex items-center justify-between"><span class="font-label-sm text-label-sm uppercase text-outline">Streak Rule</span><span class="font-label-sm text-label-sm text-primary" >Consecutive days</span></div><span class="font-body-sm text-body-sm text-on-surface-variant" id="streak-rule"></span></div>'
                  + wrap + '<div class="flex items-center justify-between"><span class="font-label-sm text-label-sm uppercase text-outline">Storage</span><span class="font-label-sm text-label-sm text-primary">local_ledger</span></div><span class="font-body-sm text-body-sm text-on-surface-variant">Saved in this browser (<code class="text-primary">habitforge:v1</code>)</span></div>'
                  + '<button class="w-full mt-1 py-1.5 rounded bg-surface-container-lowest text-on-surface-variant hover:text-error font-label-sm text-label-sm uppercase" id="restart-btn" type="button">Restart Campaign</button>')
    h = h.replace(blk, new_blocks)
    # fix: settings popover was clipped by overflow-hidden on the control bar; clip only the progress strip instead
    h = sub(h, 'mb-space-lg relative overflow-hidden border border-outline-variant/30"><div class="absolute top-0 left-0 right-0 h-1 bg-surface-container-lowest">', 'mb-space-lg relative border border-outline-variant/30"><div class="absolute top-0 left-0 right-0 h-1 bg-surface-container-lowest overflow-hidden rounded-t">')
    # pillars
    h = empty_inner(h, r'<div class="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">(?=<!-- GROUP 1)', 'pillars')
    # codex note (from old variant, made generic)
    k = old.find('<!-- 4. Postgraduate'); k2 = old.find('<!-- Weekly Arc Horizon'); codex = old[k:k2]
    codex = codex.replace('Postgraduate Codex • Daily Research Note', 'Daily Codex • Reflection Note').replace('Field insights, thesis progress, and psychological state', 'Field insights, progress, and state of mind')
    codex = re.sub(r'<textarea([^>]*)placeholder="[^"]*"([^>]*)>.*?</textarea>', r'<textarea\1placeholder="What worked today? What dragged? Note energy, obstacles, and what you will adjust tomorrow..."\2></textarea>', codex, flags=re.S)
    codex = codex.replace('Draft saved to row #104', 'Draft saved locally').replace('Append to Ledger', 'Save Note')
    codex = re.sub(r'Tag: Thesis-Ch4', '<span id="note-tags-day">Day 1</span>', codex)
    codex = re.sub(r'Vessel: Resilient', '<span id="note-tags-score">Score: 0%</span>', codex)
    h = sub(h, '<!-- Weekly Arc Horizon Strip', codex + '<!-- Weekly Arc Horizon Strip') if '<!-- Weekly Arc Horizon Strip' in h else h
    h = sub(h, 'Weekly Quota Status (Week 7 of 13)', '<span id="week-title"></span>') if 'Weekly Quota Status (Week 7 of 13)' in h else h
    h = re.sub(r'<p class="font-body-sm text-body-sm text-outline">Weekly target habits.*?</p>', '<p class="font-body-sm text-body-sm text-outline" id="week-text"></p>', h, flags=re.S)
    h = re.sub(r'<div class="flex items-center gap-space-xs flex-shrink-0">(<div class="w-7 h-7 rounded .*?title="Sun">S</div>)</div>', '<div class="flex items-center gap-space-xs flex-shrink-0" id="week-days"></div>', h, flags=re.S)
    h = finish(h, 'desktop', ['core.js', 'tracker.js'])
    return h

def tracker_mobile():
    h = rd('daily_tracker_the_wynter_arc_mobile'); h = strip_scripts(h)
    h = common(h, 'mobile', 'Daily Tracker', 'HabitForge - forge new habits over a 3-month campaign.')
    h = sub(h, '>Supabase</span></div><a class="w-8 h-8 rounded bg-surface-container-high/60 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors" data-path="settings" href="#">', '>Local</span></div><a id="gear-btn" aria-label="Settings" class="w-8 h-8 rounded bg-surface-container-high/60 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors" data-path="settings" href="tracker.html#settings">')
    h = empty_inner(h, r'<div class="flex items-center bg-surface-container-low p-0\.5 rounded">(?=<button class="px-2\.5 py-1 rounded bg-surface-container-high text-primary)', 'hf-month')
    # date nav
    h = re.sub(r'(<button class="flex items-center justify-center h-9 px-2\.5 rounded[^"]*")( type="button"><span class="material-symbols-outlined text-\[16px\] text-tertiary">chevron_left</span><span class="font-label-sm text-label-sm uppercase ml-1">)Nov 13(</span>)', r'\1 id="prevBtn" aria-label="Previous day"\2<span id="prevLabel">Nov 13</span>\3', h, count=1)
    h = re.sub(r'(<button class="flex items-center justify-center h-9 px-2\.5 rounded[^"]*")( type="button"><span class="font-label-sm text-label-sm uppercase mr-1">)Nov 15(</span>)', r'\1 id="nextBtn" aria-label="Next day"\2<span id="nextLabel">Nov 15</span>\3', h, count=1)
    h = sub(h, 'Thu, Nov 14</span><span class="material-symbols-outlined text-[14px] text-on-surface-variant">arrow_drop_down</span></button>', '<span id="dateLabel">Today</span></span><span class="material-symbols-outlined text-[14px] text-on-surface-variant">arrow_drop_down</span></button><input id="datePicker" type="date" aria-label="Pick a date" class="absolute opacity-0 pointer-events-none w-px h-px" tabindex="-1">'.replace('</span></span>', '</span>', 1) if False else 'Thu, Nov 14</span><span class="material-symbols-outlined text-[14px] text-on-surface-variant">arrow_drop_down</span></button>')
    h = h.replace('Thu, Nov 14</span>', '</span>', 0)
    h = re.sub(r'(<span class="font-label-md text-label-md uppercase tracking-wider font-semibold text-primary">)Thu, Nov 14(</span>)', r'\1<span id="dateLabel">Today</span>\2', h, count=1)
    h = sub(h, '<div class="flex flex-col gap-space-xs bg-surface-container-low p-space-sm rounded-lg shadow-sm">', '<div class="relative flex flex-col gap-space-xs bg-surface-container-low p-space-sm rounded-lg shadow-sm"><input id="datePicker" type="date" aria-label="Pick a date" class="absolute left-1/2 top-9 opacity-0 pointer-events-none w-px h-px" tabindex="-1">')
    h = sub(h, 'NOV 14</span> • AUTO-SAVED TO SUPABASE', '<span id="ledgerDate">NOV 14</span></span> • <span id="ledgerState">AUTO-SAVED LOCALLY</span>') if False else h
    h = sub(h, '<span class="text-on-surface font-semibold">NOV 14</span> • AUTO-SAVED TO SUPABASE', '<span class="text-on-surface font-semibold" id="ledgerDate">NOV 14</span> • <span id="ledgerState">AUTO-SAVED LOCALLY</span>')
    h = sub(h, 'flex-shrink-0 ml-1">SYNCED</span>', 'flex-shrink-0 ml-1" id="syncState">SAVED</span>')
    h = sub(h, '/ 11 FORGED</span>', '<span id="strikeTotal">/ 11 FORGED</span></span>') if False else h
    h = re.sub(r'(<span class="font-label-lg text-label-lg text-on-surface-variant">)/ 11 FORGED(</span>)', r'\1<span id="strikeTotal">/ 11 FORGED</span>\2', h, count=1)
    h = sub(h, '17 DAYS</span>', '<span id="streakPill">17 DAYS</span></span>') if False else h
    h = re.sub(r'(<span class="font-label-sm text-label-sm text-secondary font-bold tracking-tight">)17 DAYS(</span>)', r'\1<span id="streakPill">17 DAYS</span>\2', h, count=1)
    h = re.sub(r'(<span class="font-label-sm text-\[10px\] text-on-surface-variant mt-1">)\+1 Day toward 18-day streak(</span>)', r'\1<span id="streakNote"></span>\2', h, count=1)
    h = sub(h, '<div class="absolute left-[75%] top-0 bottom-0 w-0.5 bg-tertiary z-10"></div>', '<div id="pinLine" class="absolute left-[75%] top-0 bottom-0 w-0.5 bg-tertiary z-10"></div>')
    h = sub(h, '<span>KAISEN MARK: 75% (8/11)</span>', '<span id="kaizenMark">KAISEN MARK: 75% (8/11)</span>')
    # pillars: replace everything between the summary card and the codex
    i = h.find('<!-- 3. FOUR HABIT'); j = h.find('<!-- 4. DAILY CODEX')
    assert 0 < i < j
    h = h[:i] + '<div id="pillars" class="contents"></div>' + h[j:]
    # codex
    h = sub(h, '<textarea class="', '<textarea id="noteArea" aria-label="Daily note" class="')
    h = sub(h, '<span class="font-label-sm text-[11px]">Draft stored locally</span>', '<span class="font-label-sm text-[11px]" id="noteStatus">Draft stored locally</span>')
    h = sub(h, '<span>Append to Supabase</span>', '<span>Save Note</span>')
    h = re.sub(r'(<button class="flex items-center gap-1\.5 px-3 py-1\.5 rounded bg-primary[^"]*")( type="button"><span class="material-symbols-outlined text-\[14px\]">bolt)', r'\1 id="save-note-btn"\2', h, count=1)
    # settings panel
    h = sub(h, '<div class="flex items-center gap-1 bg-surface-container-highest p-1 rounded"><span class="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold">75%</span><span class="px-2 py-0.5 text-on-surface-variant font-label-sm text-label-sm">85%</span><span class="px-2 py-0.5 text-on-surface-variant font-label-sm text-label-sm">100%</span></div>', '<div class="flex items-center gap-1 bg-surface-container-highest p-1 rounded" id="thresholdSeg"></div>')
    h = sub(h, '<span class="font-label-sm text-[11px] text-on-surface-variant">Default: 75% execution rate</span>', '<span class="font-label-sm text-[11px] text-on-surface-variant" id="thresholdHint">Default: 75% execution rate</span>')
    m = re.search(r'<div class="flex items-center justify-between"><div class="flex flex-col"><span class="font-body-sm text-body-sm text-on-surface font-medium">Weekly Quota Auto-Carry</span>.*?</div></div></div>', h, re.S)
    assert m
    h = h.replace(m.group(0), '<div class="flex items-center justify-between"><div class="flex flex-col"><span class="font-body-sm text-body-sm text-on-surface font-medium">Campaign</span><span class="font-label-sm text-[11px] text-on-surface-variant" id="restartStreak"></span></div><button class="px-2 py-1 rounded bg-surface-container-highest text-on-surface-variant hover:text-error font-label-sm text-label-sm uppercase" id="restart-btn" type="button">Restart Campaign</button></div>')
    h = h.replace('Thresholds &amp; Quota Parameters', 'Thresholds &amp; Campaign')
    h = sub(h, '<button class="flex items-center justify-between w-full py-1 text-left" id="toggleThresholdBtn" type="button">', '<button class="flex items-center justify-between w-full py-1 text-left" id="toggleThresholdBtn" type="button" aria-expanded="false" aria-controls="thresholdPanel">')
    h = h.replace('Daily Codex / Research Note', 'Daily Codex / Reflection Note').replace('Markdown Supported', 'Plain Text').replace('Record metallurgical progress, energy dips, thesis adjustments, and winter reflections...', 'What worked today? What dragged? Note energy, obstacles, and tomorrow\'s adjustment...')
    h = finish(h, 'mobile', ['core.js', 'tracker.js'])
    return h


def dash_desktop():
    h = strip_scripts(rd('dashboard_the_wynter_arc'))
    h = common(h, 'desktop', 'Dashboard', 'HabitForge - your 3-month habit campaign at a glance.')
    h = re.sub(r'(<div class="hidden lg:flex items-center bg-surface-container-low border border-outline-variant/50 rounded p-\[2px\]">).*?(</div><div class="hidden sm:flex)',
               r'\1<span id="hf-year" class="contents"></span><div class="h-3 w-[1px] bg-outline-variant/40 mx-1"></div><span id="hf-month" class="contents"></span>\2', h, count=1, flags=re.S)
    h = h.replace('Synced to Supabase', 'Saved locally')
    h = sub(h, '<button aria-label="Settings"', '<button id="gear-btn" aria-label="Settings"')
    # hero
    h = re.sub(r'(ac_unit</span>)WYNTER ARC • DAY 42 OF 92', r'\1<span id="hero-day"></span>', h)
    h = sub(h, '>MID-CAMPAIGN</span>', '><span id="hero-phase"></span></span>')
    h = sub(h, '>45.6%</span><span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Elapsed</span>', '><span id="hero-pct">45.6%</span></span><span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Elapsed</span>')
    h = sub(h, 'transition-all duration-700" style="width: 45.6%;"></div>', 'transition-all duration-700" id="hero-bar" style="width: 45.6%;"></div>')
    h = sub(h, '<span class="">OCT 01 • ANVIL COLD</span><span class="text-primary font-semibold">42 DAYS FORGED</span><span class="">DEC 31 • TEMPER TEST</span>', '<span class="" id="hero-start"></span><span class="text-primary font-semibold" id="hero-forged"></span><span class="" id="hero-end"></span>')
    # KPIs
    h = empty_inner(h, r'<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">', 'kpis', tag='section')
    # toggle row
    h = sub(h, 'id="toggleDataState" onclick="toggleState()" type="button">Live Telemetry (Oct/Nov)</button>', 'id="toggleDataState" type="button">Live Telemetry</button>')
    h = h.replace(' onclick="toggleSettingsPopover()"', ' data-settings-toggle').replace(' onclick="toggleState()"', ' data-cold-dismiss')
    h = sub(h, '<button class="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded text-primary bg-surface-container font-semibold">30 Days</button><button class="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded text-on-surface-variant hover:text-on-surface">90 Days</button><button class="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded text-on-surface-variant hover:text-on-surface">Year 2026</button>',
        '<span id="range-btns" class="contents"></span>')
    # settings popover selects
    h = re.sub(r'<select class="([^"]*)"><option>Strict \(80% Completion\)</option>.*?</select>', r'<select id="sel-threshold" aria-label="Target threshold" class="\1"></select>', h, count=1, flags=re.S)
    h = re.sub(r'<select class="([^"]*)"><option>Rolling 7-Day Weighted</option>.*?</select>', r'<select id="sel-pacing" aria-label="Pacing algorithm" class="\1"><option value="weighted">Rolling 7-Day Weighted</option><option value="mean">Absolute Arithmetic Mean</option><option value="decay">Ember Streak Decay</option></select>', h, count=1, flags=re.S)
    h = sub(h, 'The Wynter Arc has zero strikes', 'HabitForge has zero strikes') if 'The Wynter Arc has zero strikes' in h else h
    h = re.sub(r'HabitForge has zero strikes logged for Day 1\. Initialize your habit schedule or pull past logs from Sheets\.', 'HabitForge has no strikes logged yet. Log your first strike in the Daily Tracker, or load a sample ledger to preview the dashboard.', h)
    h = sub(h, 'bg-primary text-on-primary font-bold hover:bg-primary-container transition-colors">Seed Initial Strike</button>', 'bg-primary text-on-primary font-bold hover:bg-primary-container transition-colors" id="seed-btn">Load Sample Ledger</button>')
    h = sub(h, 'data-cold-dismiss>Dismiss Cold View</button>', 'data-cold-dismiss id="cold-dismiss">Dismiss</button>') if 'data-cold-dismiss>Dismiss Cold View</button>' in h else h
    # chart
    h = sub(h, 'Discipline Baseline (70%)', 'Discipline Baseline (<span id="base-pct">75</span>%)')
    h = empty_inner(h, r'<div class="relative w-full h-\[260px\][^"]*">', 'chart-host')
    h = sub(h, 'Current Slope: +0.64% daily', '<span id="chart-slope"></span>')
    # donut + bars
    h = empty_inner(h, r'<div class="my-space-md relative flex items-center justify-center">', 'donut-host')
    h = empty_inner(h, r'<div class="space-y-space-sm pt-space-xs">', 'pillar-bars')
    h = sub(h, 'Forged strikes vs omitted obligations this month.', 'Forged strikes vs omitted obligations, last 30 days.')
    # table
    h = sub(h, 'Week 06 / Cycle II', '<span id="week-no"></span>')
    h = sub(h, '<button class="font-label-sm text-label-sm uppercase px-space-md py-space-xs rounded bg-surface-container-high text-on-surface hover:text-primary hover:bg-surface-container-highest transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">file_download</span>', '<button id="export-btn" type="button" class="font-label-sm text-label-sm uppercase px-space-md py-space-xs rounded bg-surface-container-high text-on-surface hover:text-primary hover:bg-surface-container-highest transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">file_download</span>')
    h = empty_inner(h, r'<tbody class="font-body-md text-body-md text-on-surface divide-y-0">', 'kaizen-body', tag='tbody')
    h = sub(h, 'The 4-pillar anvil check.', 'The 4-pillar anvil check (Mon-Sun).')
    h = empty_inner(h, r'<div class="grid grid-flow-col grid-rows-7 gap-1\.5 min-w-\[640px\]">', 'heat-host')
    h = sub(h, 'Each block represents a single sunrise-to-sunset strike during isolation.', 'Each block represents a single day of the campaign.')
    h = sub(h, '90-Day Winter Crucible Matrix', '<span id="heat-title">90-Day</span> Winter Crucible Matrix') if False else h
    return finish(h, 'desktop', ['core.js', 'dashboard.js'])

def dash_mobile():
    h = strip_scripts(rd('dashboard_the_wynter_arc_mobile'))
    h = common(h, 'mobile', 'Dashboard', 'HabitForge - your 3-month habit campaign at a glance.')
    h = sub(h, '>Supabase</span></div><a class="w-8 h-8 rounded bg-surface-container-high/60 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors" data-path="settings" href="#">', '>Local</span></div><a id="gear-btn" aria-label="Settings" class="w-8 h-8 rounded bg-surface-container-high/60 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors" data-path="settings" href="tracker.html#settings">')
    h = empty_inner(h, r'<div class="flex items-center bg-surface-container-low p-0\.5 rounded">(?=<button class="px-2\.5 py-1 rounded bg-surface-container-high text-primary)', 'hf-month')
    h = sub(h, 'Day 42 of 92</span><span class="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high/90 text-on-surface-variant font-label-sm text-label-sm">45.6% ELAPSED</span>', '<span id="hero-day">Day 42 of 92</span></span><span class="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high/90 text-on-surface-variant font-label-sm text-label-sm"><span id="hero-pct">45.6%</span>&nbsp;ELAPSED</span>')
    h = empty_inner(h, r'<div class="grid grid-cols-2 gap-space-xs">', 'kpis')
    h = sub(h, 'Day 41:</span><span class="font-label-sm text-[10px] text-primary uppercase font-bold">92.8%</span>', '<span id="chart-last-label">Day 41:</span></span><span class="font-label-sm text-[10px] text-primary uppercase font-bold" id="chart-last">92.8%</span>')
    h = empty_inner(h, r'<div class="w-full h-32 relative bg-surface-container-lowest rounded-lg p-2 overflow-hidden flex flex-col justify-end">', 'chart-host')
    h = empty_inner(h, r'<div class="relative w-24 h-24 flex items-center justify-center">', 'donut-host')
    h = empty_inner(h, r'<div class="col-span-7 flex flex-col gap-2">', 'pillar-bars')
    h = sub(h, 'WEEK 06</span>', '<span id="week-no">WEEK 06</span></span>')
    h = empty_inner(h, r'<div class="flex flex-col gap-1\.5">(?=<!-- Habit 1 -->)', 'kaizen-list')
    h = sub(h, 'Day 42 / 92</span></div><div class="flex flex-wrap', '<span id="heat-day">Day 42 / 92</span></span></div><div class="flex flex-wrap')
    h = sub(h, 'Tempered (41d)', '<span id="lg-tempered">Tempered</span>').replace('Today (D42)', '<span id="lg-today">Today</span>').replace('Frozen (48d)', '<span id="lg-frozen">Frozen</span>')
    h = sub(h, '<span class="">Oct (D01-31)</span><span class="">Nov (D32-61)</span><span class="">Dec (D62-90)</span>', '<span id="heat-months" class="contents"></span>')
    h = empty_inner(h, r'<div class="w-full" style="display: grid; grid-template-columns: repeat\(10, minmax\(0, 1fr\)\); gap: 4px;">', 'heat-host')
    h = sub(h, '<span class="text-on-surface-variant font-medium">OCT 01</span><span class="text-primary font-bold tracking-wide">DAY 42 (46.7%)</span><span class="text-on-surface-variant font-medium">DEC 31</span>', '<span class="text-on-surface-variant font-medium" id="heat-start">OCT 01</span><span class="text-primary font-bold tracking-wide" id="heat-mid">DAY 42</span><span class="text-on-surface-variant font-medium" id="heat-end">DEC 31</span>')
    h = sub(h, 'transition-all" style="width: 46.7%"></div>', 'transition-all" id="heat-bar" style="width: 46.7%"></div>') if 'transition-all" style="width: 46.7%"></div>' in h else re.sub(r'(<div class="h-full bg-gradient-to-r from-primary-container to-tertiary-container rounded-full")( style="width: 46\.7%"></div>)', r'\1 id="heat-bar"\2', h, count=1)
    h = sub(h, 'Streak: <strong class="text-on-surface">18d</strong></span><span class="text-primary-fixed uppercase font-semibold">48 Days Remaining</span><span class="">Pacing: <strong class="text-tertiary">On Track</strong></span>', 'Streak: <strong class="text-on-surface" id="heat-streak">0d</strong></span><span class="text-primary-fixed uppercase font-semibold" id="heat-remain"></span><span class="">Pacing: <strong class="text-tertiary" id="heat-pace">On Track</strong></span>')
    h = sub(h, 'Telemetry clean • Supabase ledger active</span></div><span class="font-label-sm text-[9px] text-tertiary uppercase font-mono">v2.4-crucible</span>', '<span id="foot-state">Telemetry clean • Local ledger active</span></span></div><span class="font-label-sm text-[9px] text-tertiary uppercase font-mono" id="seed-wrap"></span>')
    return finish(h, 'mobile', ['core.js', 'dashboard.js'])

if __name__ == '__main__':
    os.makedirs('m', exist_ok=True)
    open('tracker.html', 'w').write(tracker_desktop())
    open('m/tracker.html', 'w').write(tracker_mobile())
    open('index.html', 'w').write(dash_desktop())
    open('m/index.html', 'w').write(dash_mobile())
    print('built all')

