import pathlib,re,collections
files=['styles/small.css','styles/larger.css']
for f in files:
    p=pathlib.Path(f)
    if not p.exists():
        print(f'MISSING {f}')
        continue
    txt=p.read_text(encoding='utf-8')
    pattern=re.compile(r'([^{}]+)\{([^{}]*)\}')
    rules=pattern.findall(txt)
    decl_count=0
    props=[]
    colors=[]
    for sel,body in rules:
        props_list=[x.strip() for x in body.split(';') if x.strip()]
        decl_count+=len(props_list)
        for prop in props_list:
            props.append(prop.split(':',1)[0].strip())
            for m in re.findall(r'#[0-9A-Fa-f]{3,6}',prop):
                colors.append(m.lower())
            for m in re.findall(r'rgba?\([^\)]*\)',prop):
                colors.append(m)
            m2=re.findall(r':\s*([a-zA-Z\-]+)\s*(;|$)',prop)
            for name, _ in m2:
                if name.lower() not in ('0','none','auto','inherit','initial') and not re.match(r'^\d',name):
                    colors.append(name.lower())
    prop_counts=collections.Counter(props)
    color_counts=collections.Counter(colors)
    print('\nFile:',f)
    print('  Rules found:', len(rules))
    print('  Total declarations:', decl_count)
    print('  Top properties:')
    for k,v in prop_counts.most_common(10): print(f'    {k}: {v}')
    print('  Unique color tokens:', len(color_counts))
    for k,v in color_counts.most_common(15): print(f'    {k}: {v}')
