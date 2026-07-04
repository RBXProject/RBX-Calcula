(() => {
  'use strict';

  const STORAGE = {
    favorites: 'rbx-calc-favorites-v1',
    history: 'rbx-calc-history-v1',
    theme: 'rbx-calc-theme-v1'
  };

  const categories = [
    { id: 'roofs', name: 'Telhados', icon: '⌂', description: 'Áreas, inclinações, coberturas e treliças.' },
    { id: 'wood-stairs', name: 'Escadas de madeira', icon: '↗', description: 'Degraus, espelhos, patamares e inclinações.' },
    { id: 'metal-stairs', name: 'Escadas metálicas', icon: '⌁', description: 'Estruturas retas, curvas e em zigue-zague.' },
    { id: 'concrete', name: 'Fundações e concreto', icon: '▰', description: 'Fundações, lajes, anéis e elementos de concreto.' },
    { id: 'materials', name: 'Materiais de construção', icon: '◇', description: 'Concreto, aço, madeira, tinta e revestimentos.' },
    { id: 'walls-floors', name: 'Cercas, paredes e pisos', icon: '▦', description: 'Vedações, alvenaria, pisos e decks.' },
    { id: 'earthworks', name: 'Terraplenagem', icon: '▽', description: 'Escavações, valas, poços, terrenos e piscinas.' },
    { id: 'volumes', name: 'Volume e capacidade', icon: '◉', description: 'Tubos, tanques, reservatórios e ventilação.' },
    { id: 'production', name: 'Produção e máquinas', icon: '⚙', description: 'Custo horário, produtividade, frota e equipamentos.' },
    { id: 'budget', name: 'Custos e orçamento', icon: 'R$', description: 'BDI, mão de obra, equipes, mobilização e custos indiretos.' },
    { id: 'electrical', name: 'Engenharia elétrica', icon: '⚡', description: 'Cargas, cabos, motores, geradores, aterramento e energia provisória.' },
    { id: 'hydraulics', name: 'Engenharia hidráulica', icon: '≈', description: 'Perdas de carga, bombas, reservação, drenagem e vazões.' },
    { id: 'mechanical', name: 'Engenharia mecânica', icon: '⚙', description: 'Torque, potência, ar comprimido, ventilação, içamento e transmissão.' },
    { id: 'safety', name: 'Segurança do trabalho', icon: '⚠', description: 'EPI, ruído, calor, ventilação, emergência e indicadores de SST.' },
    { id: 'industrial', name: 'Ambientes industriais', icon: '▣', description: 'OEE, manutenção, estoque, armazenagem, logística interna e utilidades.' },
    { id: 'management', name: 'Gestão geral de obras', icon: '▥', description: 'Prazo, produtividade, custos, suprimentos, avanço físico e recursos.' },
    { id: 'other', name: 'Outras calculadoras', icon: '✦', description: 'Iluminação, crédito, móveis e geometrias.' }
  ];

  const c = (id, name, category, template, description, icon, config = {}) => ({
    id, name, category, template, description, icon, config
  });

  const calculators = [
    c('roof-rafters', 'Dimensionamento preliminar de vigas', 'roofs', 'roof', 'Estime comprimento de água, área inclinada e quantidade de cobertura.', '⌂', { framing: true }),
    c('roof-gable', 'Telhado de duas águas', 'roofs', 'roof', 'Calcule área das duas águas, inclinação, cobertura e custo.', '⌃', { sides: 2 }),
    c('roof-single', 'Telhado de uma água', 'roofs', 'roof', 'Estime a área de um telhado com inclinação única.', '╱', { sides: 1 }),
    c('roof-mansard', 'Telhado mansarda', 'roofs', 'roof', 'Estimativa preliminar para cobertura mansarda com fator geométrico.', '⌂', { factor: 1.28 }),
    c('roof-hip', 'Telhado de quatro águas', 'roofs', 'roof', 'Área inclinada e materiais para telhado de quatro águas.', '◆', { factor: 1.12 }),
    c('wood-truss', 'Treliça triangular de madeira', 'roofs', 'roof', 'Estime vão, altura, comprimento das pernas e área coberta.', '△', { truss: true }),

    c('stair-straight', 'Escada reta de madeira', 'wood-stairs', 'stairs', 'Dimensione degraus, espelhos, piso, ângulo e comprimento.', '↗'),
    c('stair-quarter', 'Escada com giro de 90°', 'wood-stairs', 'stairs', 'Estimativa de dois lances com patamar e giro de 90 graus.', '⌝', { turn: 90, factor: 1.08 }),
    c('stair-quarter-winders', 'Escada 90° com degraus compensados', 'wood-stairs', 'stairs', 'Cálculo preliminar de lances com degraus de giro.', '⤴', { turn: 90, factor: 1.13 }),
    c('stair-half', 'Escada com giro de 180°', 'wood-stairs', 'stairs', 'Dimensione dois lances paralelos e patamar intermediário.', '↶', { turn: 180, factor: 1.12 }),
    c('stair-half-winders', 'Escada 180° com degraus compensados', 'wood-stairs', 'stairs', 'Estimativa para escada em U com degraus de giro.', '⤵', { turn: 180, factor: 1.17 }),
    c('stair-three-flight', 'Escada com três lances', 'wood-stairs', 'stairs', 'Dimensionamento preliminar com três lances e patamares.', '≋', { factor: 1.2 }),
    c('stair-three-winders', 'Escada de três lances compensada', 'wood-stairs', 'stairs', 'Estimativa de três lances com degraus compensados.', '≋', { factor: 1.25 }),
    c('stair-spiral', 'Escada caracol', 'wood-stairs', 'spiralStairs', 'Calcule degraus, passo angular, altura e desenvolvimento.', '◎'),
    c('stair-stringer', 'Escada reta sobre longarinas', 'wood-stairs', 'stairs', 'Comprimento de longarinas, número de degraus e inclinação.', '⫯', { factor: 1.04 }),

    c('metal-stair-straight', 'Escada metálica reta', 'metal-stairs', 'stairs', 'Dimensionamento preliminar de escada metálica de um lance.', '↗', { metal: true }),
    c('metal-stair-zigzag', 'Escada metálica em zigue-zague', 'metal-stairs', 'stairs', 'Estime perfis laterais, degraus e inclinação.', 'ϟ', { metal: true, factor: 1.08 }),
    c('metal-stair-quarter', 'Escada metálica com giro de 90°', 'metal-stairs', 'stairs', 'Dois lances metálicos com patamar de 90 graus.', '⌝', { metal: true, factor: 1.12 }),
    c('metal-stair-quarter-zigzag', 'Escada metálica 90° em zigue-zague', 'metal-stairs', 'stairs', 'Estimativa de longarinas metálicas recortadas e giro.', 'ϟ', { metal: true, factor: 1.17 }),
    c('metal-stair-half', 'Escada metálica com giro de 180°', 'metal-stairs', 'stairs', 'Dois lances paralelos e estrutura de patamar.', '↶', { metal: true, factor: 1.16 }),
    c('metal-stair-half-zigzag', 'Escada metálica 180° em zigue-zague', 'metal-stairs', 'stairs', 'Estimativa preliminar para escada metálica em U.', 'ϟ', { metal: true, factor: 1.21 }),
    c('oblique-riser', 'Espelho de escada chanfrado', 'metal-stairs', 'trapezoid', 'Calcule diagonal, ângulo e área de uma peça chanfrada.', '◩'),

    c('concrete-stairs', 'Escada de concreto armado', 'concrete', 'stairs', 'Estime geometria e volume aproximado de concreto.', '▰', { concrete: true, factor: 1.18 }),
    c('strip-foundation', 'Fundação corrida', 'concrete', 'stripFoundation', 'Calcule volume de concreto, perdas e custo da fundação.', '▬'),
    c('pile-foundation', 'Fundação em estacas', 'concrete', 'pileFoundation', 'Estime volume total de estacas cilíndricas.', '║'),
    c('foundation-slab', 'Radier / placa de fundação', 'concrete', 'slab', 'Volume de concreto para laje de fundação.', '▱'),
    c('concrete-ring', 'Anéis de concreto', 'concrete', 'ring', 'Calcule volume, peso aproximado e custo de anéis.', '◉'),
    c('diagonal', 'Diagonal de esquadro', 'concrete', 'diagonal', 'Confira diagonal, área e perímetro de um retângulo.', '╱'),
    c('pavers', 'Piso intertravado', 'concrete', 'tile', 'Quantidade de peças, área com perdas e custo.', '▦', { defaultPieceW: 20, defaultPieceH: 10 }),
    c('blind-area', 'Calçada perimetral', 'concrete', 'stripArea', 'Área e volume da calçada ao redor de uma edificação.', '▭'),

    c('concrete-mix', 'Traço e consumo de concreto', 'materials', 'concreteMix', 'Estime cimento, areia, brita, água e custo.', '▰'),
    c('sawn-wood', 'Madeira serrada', 'materials', 'wood', 'Volume, quantidade, perdas e custo de peças de madeira.', '▥'),
    c('rebar', 'Aço para armadura', 'materials', 'rebar', 'Comprimento, peso e custo de barras de aço.', '≡'),
    c('reinforcement-mesh', 'Malha de reforço', 'materials', 'mesh', 'Quantidade de barras, comprimento e peso da malha.', '#'),
    c('ceramic-tiles', 'Revestimento cerâmico', 'materials', 'tile', 'Peças necessárias, perdas, argamassa e custo.', '▦', { defaultPieceW: 60, defaultPieceH: 60 }),
    c('drywall', 'Gesso acartonado / drywall', 'materials', 'drywall', 'Chapas, perfis, parafusos e área de parede.', '▤'),
    c('paint', 'Consumo de tinta', 'materials', 'paint', 'Litros de tinta considerando demãos, rendimento e perdas.', '◒'),
    c('wallpaper', 'Papel de parede', 'materials', 'wallpaper', 'Número de rolos considerando altura, repetição e perdas.', '▥'),
    c('sheet-fasteners', 'Fixadores para chapas', 'materials', 'fasteners', 'Quantidade de parafusos ou rebites por espaçamento.', '•'),
    c('metal-grating', 'Grelha metálica', 'materials', 'floor', 'Área, quantidade de painéis e custo estimado.', '▦', { productLabel: 'painel', defaultCoverage: 1 }),

    c('round-log-wall', 'Parede de toras', 'walls-floors', 'wall', 'Volume e quantidade aproximada de toras para parede.', '▥', { log: true }),
    c('masonry-wall', 'Alvenaria de blocos', 'walls-floors', 'wall', 'Blocos, argamassa, área líquida e custo.', '▦'),
    c('metal-fence', 'Cerca metálica', 'walls-floors', 'fence', 'Postes, painéis, área e custo de fechamento.', '╫'),
    c('brick-fence', 'Muro de tijolos', 'walls-floors', 'wall', 'Tijolos, argamassa, área e custo estimado.', '▦', { brick: true }),
    c('arched-fence', 'Arcos para cercas', 'walls-floors', 'arch', 'Raio, comprimento de arco e desenvolvimento.', '⌒'),
    c('floor-materials', 'Materiais para piso', 'walls-floors', 'floor', 'Área, unidades, perdas e custo de revestimento.', '▦'),
    c('decking', 'Deck de madeira', 'walls-floors', 'decking', 'Réguas, área, espaçamento, perdas e custo.', '▥'),
    c('self-leveling-floor', 'Piso autonivelante', 'walls-floors', 'slab', 'Volume, massa e custo do revestimento autonivelante.', '▱', { thin: true }),
    c('canopy', 'Marquise / cobertura leve', 'walls-floors', 'roof', 'Área inclinada, cobertura e custo de uma marquise.', '⌐', { sides: 1 }),
    c('horizontal-boards', 'Revestimento com tábuas', 'walls-floors', 'decking', 'Quantidade de tábuas para revestimento horizontal.', '▥', { wallMode: true }),

    c('plot-area', 'Área de terreno irregular', 'earthworks', 'area', 'Calcule a área aproximada por coordenadas ou dimensões médias.', '◇'),
    c('foundation-pit', 'Escavação retangular', 'earthworks', 'trench', 'Volume de corte, empolamento, transporte e custo.', '▽', { pit: true }),
    c('cylindrical-well', 'Poço cilíndrico', 'earthworks', 'well', 'Volume escavado, revestimento e capacidade.', '◉'),
    c('trench', 'Vala / trincheira', 'earthworks', 'trench', 'Volume de escavação com largura de topo e fundo.', '⌄'),
    c('rolled-lawn', 'Grama em placas', 'earthworks', 'floor', 'Área, rolos ou placas, perdas e custo.', '▧', { productLabel: 'rolo', defaultCoverage: 1 }),
    c('pool', 'Piscina retangular', 'earthworks', 'pool', 'Volume de água, área de revestimento e custo de enchimento.', '▱'),

    c('pipe-volume', 'Volume interno de tubulação', 'volumes', 'pipe', 'Capacidade, volume por metro e massa de líquido.', '◌'),
    c('horizontal-tank', 'Tanque cilíndrico horizontal', 'volumes', 'tankCylinder', 'Volume total e volume ocupado pelo nível informado.', '◉', { horizontal: true }),
    c('vertical-barrel', 'Tanque cilíndrico vertical', 'volumes', 'tankCylinder', 'Capacidade e volume pelo percentual de enchimento.', '◉'),
    c('rectangular-tank', 'Reservatório retangular', 'volumes', 'tankRect', 'Capacidade total, volume útil e massa do líquido.', '▭'),
    c('receiver-volume', 'Volume de vaso receptor', 'volumes', 'tankCylinder', 'Volume geométrico de reservatório cilíndrico.', '◉', { receiver: true }),
    c('truncated-pyramid', 'Planificação de tronco de pirâmide', 'volumes', 'truncated', 'Área lateral, volumes e geratriz aproximada.', '◩'),
    c('truncated-cone', 'Planificação de tronco de cone', 'volumes', 'truncatedCone', 'Volume, área lateral e geratriz de tronco cônico.', '◒'),
    c('gravel-pile', 'Pilha de areia ou brita', 'volumes', 'gravel', 'Volume e massa aproximada de pilha cônica.', '△'),
    c('ventilation', 'Volume de ar e ventilação', 'volumes', 'ventilation', 'Vazão necessária por volume e renovações de ar.', '≈'),
    c('foundation-vents', 'Respiros de fundação', 'volumes', 'fasteners', 'Quantidade de aberturas por área e espaçamento.', '□', { vents: true }),
    c('water-temperature', 'Mistura de água', 'volumes', 'waterMix', 'Temperatura final após misturar dois volumes de água.', '≈'),
    c('tank-horizontal-level', 'Tanque horizontal por nível', 'volumes', 'tankCylinder', 'Volume de tanque horizontal calculado por nível do líquido em metros.', '◉', { horizontal: true, levelMode: true }),
    c('tank-vertical-level', 'Tanque vertical por nível', 'volumes', 'tankCylinder', 'Volume de tanque vertical calculado por altura real do líquido.', '◉', { levelMode: true }),
    c('tank-rect-level', 'Reservatório retangular por nível', 'volumes', 'tankRect', 'Volume por metragem do nível do líquido em reservatórios retangulares.', '▭'),

    c('machine-hourly-cost', 'Custo horário de máquina', 'production', 'machineHourlyCost', 'Custo por hora considerando combustível, operador, manutenção e depreciação.', '⚙'),
    c('machine-production', 'Produção de escavadeira/carregadeira', 'production', 'machineProduction', 'Produtividade horária por capacidade, ciclo, eficiência e fator de enchimento.', '⛏'),
    c('truck-haulage', 'Transporte por caminhões', 'production', 'truckHaulage', 'Número de viagens, produção horária e custo de transporte por distância.', '▰'),
    c('fleet-balance', 'Balanceamento escavadeira x caminhões', 'production', 'fleetBalance', 'Dimensione a frota necessária para acompanhar uma escavadeira ou carregadeira.', '⇄'),
    c('compaction-production', 'Produção de compactação', 'production', 'compactionProduction', 'Área compactada por hora por largura, velocidade, passadas e eficiência.', '▤'),
    c('fuel-cost', 'Consumo e custo de combustível', 'production', 'fuelCost', 'Custo de diesel por hora, turno, mês e por unidade produzida.', '⛽'),
    c('equipment-depreciation', 'Depreciação de equipamento', 'production', 'equipmentDepreciation', 'Custo de propriedade por hora útil com vida econômica e valor residual.', '◇'),
    c('concrete-pump-production', 'Produção de bomba de concreto', 'production', 'concretePump', 'Tempo e custo de bombeamento por volume, produção e mobilização.', '⇧'),
    c('crusher-production', 'Produção de britagem / peneiramento', 'production', 'plantProduction', 'Produção efetiva, consumo energético e custo por tonelada.', '▧'),

    c('labor-crew-cost', 'Custo de equipe de mão de obra', 'budget', 'laborCrewCost', 'Custo diário e mensal por composição de equipe, encargos e horas extras.', '☷'),
    c('crew-productivity', 'Produtividade de equipe', 'budget', 'crewProductivity', 'Duração, custo e produtividade para serviços de obra por equipe.', '↟'),
    c('bdi-calculator', 'BDI e preço de venda', 'budget', 'bdi', 'Calcule BDI, preço de venda, impostos, lucro e despesas indiretas.', '%'),
    c('unit-composition', 'Composição unitária de serviço', 'budget', 'unitComposition', 'Custo unitário com material, mão de obra, equipamento, perdas e BDI.', 'Σ'),
    c('mobilization-cost', 'Mobilização e desmobilização', 'budget', 'mobilization', 'Custo de transporte, equipe, hospedagem e mobilização de equipamentos.', '⇆'),
    c('daily-overhead', 'Administração local da obra', 'budget', 'dailyOverhead', 'Rateio de equipe administrativa, instalações e custos indiretos por dia.', '▣'),
    c('material-loss', 'Perdas e arredondamento de compra', 'budget', 'materialLoss', 'Quantidade final de compra com perdas, embalagem comercial e reserva técnica.', '⌁'),
    c('schedule-physical-financial', 'Cronograma físico-financeiro', 'budget', 'scheduleFinance', 'Distribuição de custo por prazo, avanço físico e desembolso mensal.', '▥'),


    c('mortar-plaster', 'Chapisco, emboço e reboco', 'walls-floors', 'mortarLayer', 'Argamassa, cimento, areia, volume e custo para camadas de revestimento.', '▧'),
    c('screed-floor', 'Contrapiso e regularização', 'walls-floors', 'screedFloor', 'Volume, argamassa e custo para contrapiso por espessura.', '▱'),
    c('mortar-laying', 'Argamassa de assentamento', 'walls-floors', 'layingMortar', 'Volume de argamassa para assentamento de blocos ou tijolos.', '▦'),
    c('grout-joints', 'Rejunte para pisos e revestimentos', 'materials', 'grout', 'Consumo de rejunte por tamanho da peça, junta, espessura e área.', '▦'),
    c('putty-coating', 'Massa corrida / massa acrílica', 'materials', 'coatingMass', 'Quantidade de massa por área, demãos, rendimento e perdas.', '◫'),
    c('waterproofing-area', 'Impermeabilização de áreas', 'materials', 'waterproofing', 'Manta, primer ou impermeabilizante por área, demãos e consumo.', '▣'),
    c('formwork-beams-columns', 'Formas para pilares e vigas', 'concrete', 'formwork', 'Área de forma, reaproveitamento, chapas e custo para concreto moldado.', '▤'),
    c('slab-formwork', 'Forma de laje', 'concrete', 'slabFormwork', 'Chapas, área de forma, reaproveitamento e custo para laje.', '▥'),
    c('slab-shoring', 'Escoramento de laje', 'concrete', 'shoring', 'Quantidade de escoras por área, espaçamento e reserva técnica.', '║'),
    c('concrete-curing', 'Cura de concreto', 'concrete', 'curing', 'Produto de cura, manta úmida ou água por área de concreto.', '≈'),
    c('concrete-floor-joints', 'Juntas de piso de concreto', 'concrete', 'floorJoints', 'Comprimento de juntas, selante e barras de transferência.', '╋'),
    c('rebar-cut-bend', 'Corte, dobra e perdas de aço', 'materials', 'rebarCutBend', 'Perdas, comprimento comercial, sobras e custo de aço cortado/dobrado.', '≡'),
    c('cold-water-piping', 'Tubulação de água fria', 'volumes', 'linearPipeCost', 'Comprimento, conexões, perdas, suporte e custo de tubulação.', '◌'),
    c('sewer-slope', 'Esgoto sanitário com declividade', 'volumes', 'sewerSlope', 'Desnível, inclinação, cotas e comprimento de rede de esgoto.', '⌄'),
    c('storm-drainage', 'Drenagem: vala, tubo e brita', 'earthworks', 'drainage', 'Volume de escavação, tubo, brita drenante e geotêxtil.', '▽'),
    c('conduit-cable', 'Eletrodutos e cabos', 'other', 'conduitCable', 'Comprimento de eletroduto, cabos, circuitos, perdas e custo.', '⚡'),
    c('electrical-load', 'Carga elétrica e disjuntor', 'other', 'electricalLoad', 'Corrente estimada, potência, tensão, fator de demanda e disjuntor.', '⚡'),
    c('solar-basic', 'Pré-dimensionamento solar', 'other', 'solarBasic', 'Potência fotovoltaica preliminar por consumo mensal e horas de sol.', '☼'),
    c('waste-bins', 'Caçambas de entulho', 'earthworks', 'wasteBins', 'Quantidade de caçambas por volume, empolamento e capacidade.', '▰'),
    c('earthwork-sections', 'Terraplenagem por seções', 'earthworks', 'earthworkSections', 'Volume aproximado entre seções por áreas médias e distância.', '▱'),
    c('asphalt-paving', 'Pavimentação asfáltica', 'earthworks', 'asphaltPaving', 'Massa de CBUQ, pintura de ligação, transporte e custo.', '▬'),
    c('concrete-pavement', 'Pavimento de concreto', 'concrete', 'concretePaving', 'Volume de concreto, juntas, tela e custo para pavimento rígido.', '▦'),
    c('lifting-crane', 'Içamento com guindaste', 'production', 'liftingProduction', 'Tempo, ciclos, produtividade e custo de içamento.', '↥'),
    c('mixer-truck-cycle', 'Caminhão betoneira / concretagem', 'production', 'mixerTruckCycle', 'Viagens, frota, tempo de descarga e programação de concretagem.', '◉'),
    c('equipment-rental', 'Aluguel de equipamentos', 'budget', 'equipmentRental', 'Custo de locação por diária, horas mínimas, mobilização e operador.', '⚙'),
    c('safety-costs', 'EPI, sinalização e segurança', 'budget', 'safetyCosts', 'Custo por colaborador, placas, cones, isolamento e reserva técnica.', '⚠'),
    c('site-facilities', 'Canteiro provisório', 'budget', 'siteFacilities', 'Instalações provisórias, containers, energia, água e manutenção mensal.', '▣'),


    c('pro-voltage-drop', 'Queda de tensão em cabos', 'electrical', 'professionalFormula', 'Queda de tensão, percentual e tensão final por comprimento, corrente e seção.', '⚡', { kind: 'voltageDrop', diagram: 'electric' }),
    c('pro-cable-current', 'Corrente e seção de cabo preliminar', 'electrical', 'professionalFormula', 'Corrente de projeto, reserva e seção preliminar por densidade de corrente.', '▧', { kind: 'cableSizing', diagram: 'electric' }),
    c('pro-conduit-fill', 'Ocupação de eletroduto', 'electrical', 'professionalFormula', 'Taxa de ocupação por diâmetro dos cabos e diâmetro interno do eletroduto.', '◌', { kind: 'conduitFill', diagram: 'electric' }),
    c('pro-transformer', 'Dimensionamento de transformador', 'electrical', 'professionalFormula', 'kVA necessário por potência ativa, demanda, fator de potência e reserva.', '▣', { kind: 'transformerSizing', diagram: 'electric' }),
    c('pro-generator', 'Dimensionamento de gerador', 'electrical', 'professionalFormula', 'kVA de gerador considerando carga em regime, maior motor e partida.', '⚡', { kind: 'generatorSizing', diagram: 'electric' }),
    c('pro-motor-current', 'Corrente de motor trifásico', 'electrical', 'professionalFormula', 'Corrente nominal e corrente de partida estimada para motores trifásicos.', '◉', { kind: 'motorCurrent', diagram: 'electric' }),
    c('pro-power-factor', 'Correção de fator de potência', 'electrical', 'professionalFormula', 'Banco de capacitores necessário para correção de fator de potência.', '%', { kind: 'powerFactor', diagram: 'electric' }),
    c('pro-grounding', 'Aterramento com hastes', 'electrical', 'professionalFormula', 'Estimativa preliminar de resistência de haste e quantidade de hastes.', '╥', { kind: 'grounding', diagram: 'electric' }),
    c('pro-temporary-power', 'Energia provisória de canteiro', 'electrical', 'professionalFormula', 'Demanda de energia provisória por cargas, simultaneidade e tensão.', '▤', { kind: 'temporaryPower', diagram: 'electric' }),
    c('pro-electrical-room-heat', 'Carga térmica de sala elétrica', 'electrical', 'professionalFormula', 'Carga térmica para sala elétrica por perdas dos painéis e ganhos ambientais.', '☼', { kind: 'heatLoad', diagram: 'electric' }),

    c('pro-hazen-williams', 'Perda de carga Hazen-Williams', 'hydraulics', 'professionalFormula', 'Perda de carga em rede pressurizada por vazão, diâmetro, comprimento e C.', '≈', { kind: 'hazenWilliams', diagram: 'hydraulic' }),
    c('pro-darcy-weisbach', 'Perda de carga Darcy-Weisbach', 'hydraulics', 'professionalFormula', 'Perda distribuída e localizada por fator de atrito, velocidade e diâmetro.', '≈', { kind: 'darcyWeisbach', diagram: 'hydraulic' }),
    c('pro-pump-power', 'Potência hidráulica de bomba', 'hydraulics', 'professionalFormula', 'Potência em kW/cv por vazão, altura manométrica e rendimento.', '⇧', { kind: 'pumpPower', diagram: 'hydraulic' }),
    c('pro-pump-head', 'Altura manométrica total', 'hydraulics', 'professionalFormula', 'AMT com desnível, perdas, perdas locais e pressão residual.', '↥', { kind: 'pumpHead', diagram: 'hydraulic' }),
    c('pro-reservoir-autonomy', 'Reservatório por autonomia', 'hydraulics', 'professionalFormula', 'Volume de reservação por consumo diário, autonomia e reserva técnica.', '▭', { kind: 'reservoirAutonomy', diagram: 'hydraulic' }),
    c('pro-rainwater', 'Captação de água de chuva', 'hydraulics', 'professionalFormula', 'Potencial de captação por área, chuva, coeficiente e eficiência.', '☔', { kind: 'rainwaterHarvest', diagram: 'hydraulic' }),
    c('pro-fire-reserve', 'Reserva técnica de incêndio', 'hydraulics', 'professionalFormula', 'Volume de reserva por vazão de combate e duração requerida.', '▣', { kind: 'fireReserve', diagram: 'hydraulic' }),
    c('pro-sprinkler-flow', 'Vazão de sprinkler / hidrante', 'hydraulics', 'professionalFormula', 'Vazão por coeficiente K e pressão disponível.', '✶', { kind: 'sprinklerFlow', diagram: 'hydraulic' }),
    c('pro-manning-channel', 'Canaleta por Manning', 'hydraulics', 'professionalFormula', 'Vazão em canal retangular por rugosidade, declividade e seção molhada.', '⌄', { kind: 'manningChannel', diagram: 'hydraulic' }),
    c('pro-gutter-capacity', 'Calha de cobertura', 'hydraulics', 'professionalFormula', 'Vazão de chuva em cobertura e número de descidas pluviais.', '⌐', { kind: 'gutterCapacity', diagram: 'hydraulic' }),
    c('pro-downspout-count', 'Condutores verticais pluviais', 'hydraulics', 'professionalFormula', 'Quantidade de condutores por vazão de chuva e capacidade unitária.', '║', { kind: 'downspoutCount', diagram: 'hydraulic' }),
    c('pro-hydrostatic-pressure', 'Pressão hidrostática', 'hydraulics', 'professionalFormula', 'Pressão no fundo e força em parede por nível de líquido.', '◉', { kind: 'hydrostaticPressure', diagram: 'hydraulic' }),

    c('pro-hydraulic-cylinder', 'Força de cilindro hidráulico', 'mechanical', 'professionalFormula', 'Força de avanço e retorno por pressão, pistão, haste e rendimento.', '⇄', { kind: 'hydraulicCylinder', diagram: 'mechanical' }),
    c('pro-torque-power', 'Torque, potência e rotação', 'mechanical', 'professionalFormula', 'Converte potência, torque e rpm para motores, redutores e eixos.', '⚙', { kind: 'torquePower', diagram: 'mechanical' }),
    c('pro-belt-conveyor', 'Transportador de correia', 'mechanical', 'professionalFormula', 'Capacidade em t/h por velocidade, seção do material e densidade.', '▱', { kind: 'beltConveyor', diagram: 'mechanical' }),
    c('pro-hoist-winch', 'Talha / guincho de elevação', 'mechanical', 'professionalFormula', 'Tempo, potência e custo preliminar para içamento vertical.', '↥', { kind: 'hoistWinch', diagram: 'mechanical' }),
    c('pro-compressor-demand', 'Demanda de ar comprimido', 'mechanical', 'professionalFormula', 'Vazão total em pcm por ferramentas, uso, vazamentos e reserva.', '≈', { kind: 'compressorDemand', diagram: 'mechanical' }),
    c('pro-fan-airflow', 'Ventilação industrial', 'mechanical', 'professionalFormula', 'Vazão, renovações por hora e potência aproximada de ventilador.', '◌', { kind: 'fanAirflow', diagram: 'mechanical' }),
    c('pro-bearing-life', 'Vida útil de rolamento L10', 'mechanical', 'professionalFormula', 'Vida L10 por capacidade dinâmica, carga equivalente e rotação.', '◎', { kind: 'bearingLife', diagram: 'mechanical' }),
    c('pro-welding-consumption', 'Consumo de solda', 'mechanical', 'professionalFormula', 'Metal de adição, consumível e custo por comprimento e garganta.', '∿', { kind: 'weldingConsumption', diagram: 'mechanical' }),
    c('pro-air-leak-cost', 'Vazamento de ar comprimido', 'mechanical', 'professionalFormula', 'Custo mensal de vazamento por diâmetro, pressão, horas e energia.', '◌', { kind: 'airLeakCost', diagram: 'mechanical' }),
    c('pro-plate-weight', 'Peso de chapa metálica', 'mechanical', 'professionalFormula', 'Peso e custo de chapas por dimensões, espessura e densidade.', '▭', { kind: 'plateWeight', diagram: 'mechanical' }),

    c('pro-incident-rate', 'Taxa de frequência de acidentes', 'safety', 'professionalFormula', 'Indicadores de frequência e gravidade por horas trabalhadas.', '⚠', { kind: 'incidentRate', diagram: 'safety' }),
    c('pro-heat-stress', 'Exposição ao calor / pausas', 'safety', 'professionalFormula', 'Triagem simplificada de risco térmico por temperatura, umidade e atividade.', '☼', { kind: 'heatStress', diagram: 'safety' }),
    c('pro-noise-dose', 'Dose de ruído ocupacional', 'safety', 'professionalFormula', 'Dose diária por nível de dB(A), tempo de exposição e limite.', '◉', { kind: 'noiseDose', diagram: 'safety' }),
    c('pro-confined-ventilation', 'Ventilação de espaço confinado', 'safety', 'professionalFormula', 'Vazão e tempo de purga por volume e trocas de ar.', '≈', { kind: 'confinedVentilation', diagram: 'safety' }),
    c('pro-fire-extinguishers', 'Extintores por área', 'safety', 'professionalFormula', 'Quantidade preliminar por área, cobertura e fator de risco.', '▣', { kind: 'fireExtinguishers', diagram: 'safety' }),
    c('pro-ppe-stock', 'Estoque de EPI', 'safety', 'professionalFormula', 'Consumo mensal, ponto de reposição, lead time e compra sugerida.', '⚠', { kind: 'ppeStock', diagram: 'safety' }),
    c('pro-fall-clearance', 'Zona livre de queda', 'safety', 'professionalFormula', 'Altura livre para sistema de retenção de queda.', '↧', { kind: 'fallClearance', diagram: 'safety' }),
    c('pro-evacuation-time', 'Tempo de evacuação', 'safety', 'professionalFormula', 'Tempo estimado por população, capacidade de saída e deslocamento.', '⇥', { kind: 'evacuationTime', diagram: 'safety' }),
    c('pro-training-hours', 'Horas de treinamento de segurança', 'safety', 'professionalFormula', 'Carga horária total, turmas e custo de instrutor.', '▤', { kind: 'trainingHours', diagram: 'safety' }),
    c('pro-risk-matrix', 'Matriz de risco', 'safety', 'professionalFormula', 'Classificação por probabilidade, severidade e exposição.', '▦', { kind: 'riskMatrix', diagram: 'safety' }),
    c('pro-first-aid-kits', 'Kits de primeiros socorros', 'safety', 'professionalFormula', 'Quantidade de kits por efetivo e frentes de trabalho.', '✚', { kind: 'firstAidKits', diagram: 'safety' }),
    c('pro-assembly-area', 'Ponto de encontro e lotação', 'safety', 'professionalFormula', 'Área necessária para ponto de encontro seguro.', '□', { kind: 'assemblyArea', diagram: 'safety' }),

    c('pro-oee', 'OEE de equipamento / linha', 'industrial', 'professionalFormula', 'Disponibilidade, performance, qualidade e OEE operacional.', '%', { kind: 'oee', diagram: 'industrial' }),
    c('pro-takt-time', 'Takt time e ritmo de produção', 'industrial', 'professionalFormula', 'Tempo disponível por demanda e necessidade de postos.', '⏱', { kind: 'taktTime', diagram: 'industrial' }),
    c('pro-downtime-cost', 'Custo de parada operacional', 'industrial', 'professionalFormula', 'Custo de indisponibilidade por produção perdida e custo fixo.', '⏸', { kind: 'downtimeCost', diagram: 'industrial' }),
    c('pro-maintenance-plan', 'Plano de manutenção preventiva', 'industrial', 'professionalFormula', 'Horas, periodicidade, equipamentos e custo anual.', '⚙', { kind: 'maintenancePlan', diagram: 'industrial' }),
    c('pro-spare-parts-rop', 'Ponto de reposição de sobressalentes', 'industrial', 'professionalFormula', 'PR por consumo, lead time, segurança e lote de compra.', '▣', { kind: 'sparePartsROP', diagram: 'industrial' }),
    c('pro-inventory-coverage', 'Cobertura de estoque industrial', 'industrial', 'professionalFormula', 'Dias de cobertura, necessidade de compra e valor imobilizado.', '▥', { kind: 'inventoryCoverage', diagram: 'industrial' }),
    c('pro-forklift-productivity', 'Produtividade de empilhadeira', 'industrial', 'professionalFormula', 'Movimentos por hora, pallets/dia e custo por movimento.', '▤', { kind: 'forkliftProductivity', diagram: 'industrial' }),
    c('pro-warehouse-capacity', 'Capacidade de armazenagem', 'industrial', 'professionalFormula', 'Posições palete por área, níveis, corredores e ocupação.', '▦', { kind: 'warehouseCapacity', diagram: 'industrial' }),
    c('pro-industrial-water', 'Demanda de água industrial', 'industrial', 'professionalFormula', 'Consumo de processo, utilidades, perdas e reservação.', '≈', { kind: 'industrialWaterDemand', diagram: 'industrial' }),
    c('pro-compressed-air-network', 'Rede de ar comprimido', 'industrial', 'professionalFormula', 'Vazão total, simultaneidade, perdas e capacidade do compressor.', '◌', { kind: 'compressedAirNetwork', diagram: 'industrial' }),

    c('pro-earned-value', 'Valor agregado da obra', 'management', 'professionalFormula', 'PV, EV, AC, CPI, SPI, variação de custo e prazo.', 'Σ', { kind: 'earnedValue', diagram: 'management' }),
    c('pro-working-days', 'Dias úteis de obra', 'management', 'professionalFormula', 'Prazo calendário, feriados, folgas e dias efetivos.', '▥', { kind: 'workingDays', diagram: 'management' }),
    c('pro-crew-sizing', 'Dimensionamento de equipe por produção', 'management', 'professionalFormula', 'Equipe necessária por quantitativo, produtividade e prazo.', '↟', { kind: 'crewSizing', diagram: 'management' }),
    c('pro-procurement-leadtime', 'Suprimentos e lead time', 'management', 'professionalFormula', 'Data limite de compra por necessidade, lead time e segurança.', '⇆', { kind: 'procurementLeadTime', diagram: 'management' }),
    c('pro-cash-flow', 'Fluxo de caixa mensal da obra', 'management', 'professionalFormula', 'Distribuição de custo por prazo, retenção e desembolso médio.', '▥', { kind: 'cashFlowMonthly', diagram: 'management' }),
    c('pro-contingency-risk', 'Reserva de contingência por risco', 'management', 'professionalFormula', 'Reserva financeira por probabilidade, impacto e fator de exposição.', '⚠', { kind: 'contingencyRisk', diagram: 'management' }),
    c('pro-daily-kpi', 'Indicadores de produção diária', 'management', 'professionalFormula', 'Planejado x realizado, produtividade e desvio acumulado.', '▤', { kind: 'dailyProductionKPI', diagram: 'management' }),
    c('pro-resource-leveling', 'Nivelamento de recursos', 'management', 'professionalFormula', 'Recursos necessários por frente, produtividade e jornada.', '▧', { kind: 'resourceLeveling', diagram: 'management' }),
    c('pro-site-water', 'Consumo de água do canteiro', 'management', 'professionalFormula', 'Consumo de pessoas, limpeza, cura, refeitório e reserva.', '≈', { kind: 'siteWaterConsumption', diagram: 'management' }),
    c('pro-sanitary-facilities', 'Instalações sanitárias do canteiro', 'management', 'professionalFormula', 'Quantidade preliminar de sanitários, lavatórios e chuveiros.', '▣', { kind: 'sanitaryFacilities', diagram: 'management' }),
    c('pro-site-fence', 'Tapume / cerca de canteiro', 'management', 'professionalFormula', 'Perímetro, painéis, postes, portões e custo de fechamento.', '╫', { kind: 'siteFence', diagram: 'management' }),
    c('pro-temporary-road', 'Acesso provisório com brita', 'management', 'professionalFormula', 'Volume de brita e custo de estrada provisória de canteiro.', '▬', { kind: 'temporaryRoad', diagram: 'management' }),
    c('pro-yard-lighting', 'Iluminação de pátio industrial', 'management', 'professionalFormula', 'Número de projetores por área, lux desejado e potência.', '☼', { kind: 'yardLighting', diagram: 'management' }),
    c('pro-dust-control', 'Controle de poeira com caminhão-pipa', 'management', 'professionalFormula', 'Volume de água, viagens, ciclos e custo diário de umectação.', '☁', { kind: 'dustControlWater', diagram: 'management' }),

    c('pro-panel-thermal-check', 'Verificação térmica de painel elétrico', 'electrical', 'professionalFormula', 'Carga térmica de painel e sala técnica por perdas elétricas e ganhos ambientais.', '▧', { kind: 'heatLoad', diagram: 'electric' }),
    c('pro-pipe-velocity-check', 'Velocidade e perda em tubulação', 'hydraulics', 'professionalFormula', 'Verificação de velocidade e perda de carga por vazão e diâmetro.', '≈', { kind: 'darcyWeisbach', diagram: 'hydraulic' }),

    c('greenhouse', 'Estufa de duas águas', 'other', 'greenhouse', 'Área de cobertura, volume interno e materiais.', '⌂'),
    c('arched-greenhouse', 'Estufa semicircular', 'other', 'greenhouse', 'Área do arco, cobertura e volume interno.', '⌒', { arched: true }),
    c('clamp', 'Grampo em U', 'other', 'clamp', 'Comprimento desenvolvido e massa aproximada.', '∪'),
    c('lighting', 'Iluminação de ambiente', 'other', 'lighting', 'Quantidade de luminárias para o nível de iluminância.', '☼'),
    c('loan', 'Financiamento de obra', 'other', 'loan', 'Parcela, juros totais e custo efetivo aproximado.', '%'),
    c('wardrobe', 'Armário planejado', 'other', 'cabinet', 'Área de chapas, fita de borda e custo preliminar.', '▥'),
    c('drawer', 'Gaveta de móvel', 'other', 'drawer', 'Área de chapas e dimensões internas de uma gaveta.', '▤'),
    c('arch-segment', 'Segmento de arco', 'other', 'arch', 'Raio, ângulo central e comprimento do arco.', '⌒'),
    c('x-frame', 'Estrutura cruzada para móvel', 'other', 'diagonal', 'Diagonal, ângulo e comprimento de travessas.', '×'),
    c('cutting-angle', 'Ângulo de corte trapezoidal', 'other', 'trapezoid', 'Ângulo, diagonal e área de uma peça trapezoidal.', '◩')
  ];

  const num = (v) => Number(String(v ?? '').replace(',', '.')) || 0;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const ceil = (v) => Math.ceil(v - 1e-10);
  const format = (value, digits = 2) => new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(Number.isFinite(value) ? value : 0);
  const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number.isFinite(value) ? value : 0);
  const dateTime = (date = new Date()) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
  const normalize = (text) => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const field = (name, label, unit, value, help = '', min = 0, full = false) => ({ name, label, unit, value, help, min, full });
  const selectField = (name, label, value, options, help = '', full = false) => ({ name, label, unit: '', value, options, help, min: 0, full, type: 'select' });
  const result = (label, value, details, note = 'Estimativa preliminar. Confirme parâmetros, normas e condições reais antes da execução.') => ({ label, value, details, note });

  const concreteTraceOptions = {
    magro: { label: 'Traço magro — 1:4:8', cement: 1, sand: 4, gravel: 8, waterCement: 0.75, use: 'Regularização, lastro e concreto não estrutural.' },
    padrao: { label: 'Traço padrão — 1:2:3', cement: 1, sand: 2, gravel: 3, waterCement: 0.55, use: 'Uso geral em obras com validação técnica.' },
    contrapiso: { label: 'Contrapiso — 1:3:3', cement: 1, sand: 3, gravel: 3, waterCement: 0.60, use: 'Contrapisos e bases, ajustar conforme acabamento.' },
    fundacao: { label: 'Fundação simples — 1:3:4', cement: 1, sand: 3, gravel: 4, waterCement: 0.62, use: 'Fundações e elementos não especiais.' },
    forte: { label: 'Traço forte — 1:1,5:3', cement: 1, sand: 1.5, gravel: 3, waterCement: 0.50, use: 'Maior consumo de cimento; exige validação.' },
    um233: { label: 'Traço 1:2:3', cement: 1, sand: 2, gravel: 3, waterCement: 0.55, use: 'Traço comum para concreto de uso geral.' },
    um333: { label: 'Traço 1:3:3', cement: 1, sand: 3, gravel: 3, waterCement: 0.60, use: 'Traço intermediário, comum para bases e contrapisos.' },
    um343: { label: 'Traço 1:4:3', cement: 1, sand: 4, gravel: 3, waterCement: 0.65, use: 'Maior teor de areia; revisar trabalhabilidade.' },
    custom: { label: 'Personalizado', cement: 1, sand: 2, gravel: 3, waterCement: 0.55, use: 'Use as partes informadas manualmente.' }
  };
  const traceOptionsList = Object.entries(concreteTraceOptions).map(([value, item]) => ({ value, label: item.label }));
  function concreteTrace(values) {
    const selected = concreteTraceOptions[values.traceType] || concreteTraceOptions.padrao;
    if (values.traceType === 'custom') {
      return { ...selected, cement: Math.max(values.cementPart || 1, .01), sand: Math.max(values.sandPart || 0, 0), gravel: Math.max(values.gravelPart || 0, 0), waterCement: Math.max(values.waterCement || .55, .1) };
    }
    return selected;
  }


  const professionalFormulaSpecs = {
    voltageDrop: {
      fields: () => [field('power','Potência da carga','W',7500),field('voltage','Tensão','V',220),field('length','Comprimento ida','m',40),field('currentOverride','Corrente informada (0=auto)','A',0,'Use 0 para calcular pela potência.'),field('cableSection','Seção do cabo','mm²',10),field('resistivity','Resistividade cobre','Ω·mm²/m',0.0175),field('powerFactor','Fator de potência','fp',0.92),field('phases','Fases','un',3)],
      calculate: (v) => { const i=v.currentOverride>0?v.currentOverride:(v.phases>=3?v.power/Math.max(Math.sqrt(3)*v.voltage*v.powerFactor,.001):v.power/Math.max(v.voltage*v.powerFactor,.001)); const f=v.phases>=3?Math.sqrt(3):2; const drop=f*v.resistivity*v.length*i/Math.max(v.cableSection,.001); return result('Queda de tensão',`${format(drop)} V`,[['Percentual',`${format(drop/Math.max(v.voltage,.001)*100)} %`],['Corrente de projeto',`${format(i)} A`],['Tensão final',`${format(v.voltage-drop)} V`],['Seção informada',`${format(v.cableSection)} mm²`]],'Pré-dimensionamento elétrico. Confirmar seção por capacidade de corrente, queda de tensão, curto-circuito, agrupamento, temperatura e norma aplicável.'); }
    },
    cableSizing: {
      fields: () => [field('power','Potência total','W',12000),field('voltage','Tensão','V',380),field('powerFactor','Fator de potência','fp',0.92),field('demand','Fator de demanda','%',85),field('reserve','Reserva','%',20),field('currentDensity','Densidade adotada','A/mm²',4)],
      calculate: (v) => { const i=v.power*v.demand/100*(1+v.reserve/100)/Math.max(Math.sqrt(3)*v.voltage*v.powerFactor,.001); const sec=i/Math.max(v.currentDensity,.1); const comm=[1.5,2.5,4,6,10,16,25,35,50,70,95,120,150,185,240].find(s=>s>=sec)||ceil(sec); return result('Corrente de projeto',`${format(i)} A`,[['Seção calculada',`${format(sec)} mm²`],['Seção comercial sugerida',`${comm} mm²`],['Potência demandada',`${format(v.power*v.demand/100,0)} W`]],'Estimativa preliminar. Dimensionamento final deve validar método de instalação, temperatura, agrupamento, queda de tensão e proteção.'); }
    },
    conduitFill: {
      fields: () => [field('cableCount','Quantidade de cabos','un',6),field('cableDiameter','Diâmetro externo cabo','mm',8),field('conduitDiameter','Diâmetro interno eletroduto','mm',32),field('limit','Limite de ocupação','%',40)],
      calculate: (v) => { const ca=v.cableCount*Math.PI*(v.cableDiameter/2)**2; const ea=Math.PI*(v.conduitDiameter/2)**2; const fill=ca/Math.max(ea,.001)*100; return result('Ocupação do eletroduto',`${format(fill)} %`,[['Área dos cabos',`${format(ca)} mm²`],['Área interna eletroduto',`${format(ea)} mm²`],['Status',fill<=v.limit?'Dentro do limite informado':'Acima do limite informado']], 'Verifique raio de curvatura, taxa máxima de ocupação e facilidade de lançamento dos cabos.'); }
    },
    transformerSizing: {
      fields: () => [field('activePower','Potência ativa','kW',120),field('powerFactor','Fator de potência','fp',0.92),field('demand','Demanda','%',80),field('reserve','Reserva','%',20)],
      calculate: (v) => { const kva=v.activePower*v.demand/100/Math.max(v.powerFactor,.01)*(1+v.reserve/100); const commercial=[30,45,75,112.5,150,225,300,500,750,1000,1500,2000].find(x=>x>=kva)||ceil(kva); return result('Transformador sugerido',`${commercial} kVA`,[['Potência aparente calculada',`${format(kva)} kVA`],['Potência ativa demandada',`${format(v.activePower*v.demand/100)} kW`],['Reserva aplicada',`${format(v.reserve)} %`]]); }
    },
    generatorSizing: {
      fields: () => [field('runningLoad','Carga em regime','kW',90),field('largestMotor','Maior motor','kW',22),field('startFactor','Fator de partida','x',2.5),field('powerFactor','Fator de potência','fp',0.8),field('reserve','Reserva','%',15)],
      calculate: (v) => { const peak=v.runningLoad+v.largestMotor*Math.max(v.startFactor-1,0); const kva=peak/Math.max(v.powerFactor,.01)*(1+v.reserve/100); return result('Gerador estimado',`${format(kva)} kVA`,[['Pico de partida',`${format(peak)} kW`],['Carga em regime',`${format(v.runningLoad)} kW`],['Maior motor',`${format(v.largestMotor)} kW`]], 'Confirmar regime, altitude, temperatura, partida de motores, distorção harmônica e cargas críticas.'); }
    },
    motorCurrent: {
      fields: () => [field('power','Potência do motor','kW',15),field('voltage','Tensão trifásica','V',380),field('powerFactor','Fator de potência','fp',0.86),field('efficiency','Rendimento','%',90),field('startMultiplier','Multiplicador partida','x',6)],
      calculate: (v) => { const i=v.power*1000/Math.max(Math.sqrt(3)*v.voltage*v.powerFactor*(v.efficiency/100),.001); return result('Corrente nominal',`${format(i)} A`,[['Corrente de partida estimada',`${format(i*v.startMultiplier)} A`],['Potência',`${format(v.power)} kW`],['Rendimento',`${format(v.efficiency)} %`]]); }
    },
    powerFactor: {
      fields: () => [field('activePower','Potência ativa','kW',180),field('currentPF','FP atual','fp',0.78),field('targetPF','FP desejado','fp',0.95),field('unitCost','Custo capacitor','R$/kVAr',120)],
      calculate: (v) => { const p1=Math.acos(Math.min(v.currentPF,.999)); const p2=Math.acos(Math.min(v.targetPF,.999)); const kvar=Math.max(0,v.activePower*(Math.tan(p1)-Math.tan(p2))); return result('Banco de capacitores',`${format(kvar)} kVAr`,[['FP atual',`${format(v.currentPF,2)}`],['FP desejado',`${format(v.targetPF,2)}`],['Custo estimado',money(kvar*v.unitCost)]]); }
    },
    grounding: {
      fields: () => [field('soilResistivity','Resistividade do solo','Ω·m',100),field('rodLength','Comprimento haste','m',2.4),field('rodDiameter','Diâmetro haste','mm',16),field('targetResistance','Resistência alvo','Ω',10)],
      calculate: (v) => { const d=v.rodDiameter/1000; const r=v.soilResistivity/(2*Math.PI*Math.max(v.rodLength,.01))*(Math.log(4*v.rodLength/Math.max(d,.001))-1); const rods=ceil(r/Math.max(v.targetResistance,.1)); return result('Hastes estimadas',`${rods} un`,[['Resistência de uma haste',`${format(r)} Ω`],['Meta',`${format(v.targetResistance)} Ω`],['Observação','Interligação e espaçamento alteram o resultado']], 'Estimativa simplificada. Aterramento deve ser validado por medição e projeto elétrico.'); }
    },
    temporaryPower: {
      fields: () => [field('equipmentPower','Potência equipamentos','kW',85),field('lightingPower','Iluminação/tomadas','kW',12),field('simultaneity','Simultaneidade','%',75),field('voltage','Tensão trifásica','V',380),field('powerFactor','Fator de potência','fp',0.85)],
      calculate: (v) => { const kw=(v.equipmentPower+v.lightingPower)*v.simultaneity/100; const i=kw*1000/Math.max(Math.sqrt(3)*v.voltage*v.powerFactor,.001); return result('Demanda provisória',`${format(kw)} kW`,[['Corrente estimada',`${format(i)} A`],['Potência instalada',`${format(v.equipmentPower+v.lightingPower)} kW`],['Simultaneidade',`${format(v.simultaneity)} %`]]); }
    },
    heatLoad: {
      fields: () => [field('panelLoss','Perdas dos painéis','kW',6),field('roomArea','Área da sala','m²',20),field('people','Pessoas','un',2),field('externalGain','Ganho externo','W/m²',80),field('safetyFactor','Fator de segurança','%',15)],
      calculate: (v) => { const kw=(v.panelLoss*1000+v.people*120+v.roomArea*v.externalGain)/1000*(1+v.safetyFactor/100); return result('Carga térmica',`${format(kw)} kW`,[['Equivalente',`${format(kw*3412.142,0)} BTU/h`],['Perdas elétricas',`${format(v.panelLoss)} kW`],['Ganho ambiente',`${format(v.roomArea*v.externalGain,0)} W`]]); }
    },
    hazenWilliams: {
      fields: () => [field('flow','Vazão','L/s',10),field('diameter','Diâmetro interno','mm',100),field('length','Comprimento','m',120),field('coefficient','Coeficiente C','C',130)],
      calculate: (v) => { const q=v.flow/1000, d=v.diameter/1000; const hf=10.67*v.length*Math.pow(q,1.852)/Math.max(Math.pow(v.coefficient,1.852)*Math.pow(d,4.8704),.000001); return result('Perda de carga',`${format(hf)} mca`,[['Gradiente',`${format(hf/Math.max(v.length,.01))} m/m`],['Vazão',`${format(v.flow)} L/s`],['Diâmetro',`${format(v.diameter,0)} mm`]]); }
    },
    darcyWeisbach: {
      fields: () => [field('flow','Vazão','L/s',10),field('diameter','Diâmetro interno','mm',100),field('length','Comprimento','m',120),field('frictionFactor','Fator de atrito f','f',0.02),field('minorK','Perdas locais ΣK','K',2)],
      calculate: (v) => { const q=v.flow/1000,d=v.diameter/1000,a=Math.PI*d*d/4,vel=q/Math.max(a,.000001); const hf=(v.frictionFactor*v.length/Math.max(d,.001)+v.minorK)*vel*vel/(2*9.81); return result('Perda de carga total',`${format(hf)} mca`,[['Velocidade',`${format(vel)} m/s`],['Perdas locais ΣK',`${format(v.minorK)}`],['Fator f',`${format(v.frictionFactor,3)}`]]); }
    },
    pumpPower: {
      fields: () => [field('flow','Vazão','m³/h',36),field('head','Altura manométrica','mca',45),field('efficiency','Rendimento','%',70),field('energyCost','Custo energia','R$/kWh',0.85),field('hours','Horas por mês','h',220)],
      calculate: (v) => { const q=v.flow/3600; const kw=1000*9.81*q*v.head/Math.max(v.efficiency/100,.01)/1000; return result('Potência no eixo',`${format(kw)} kW`,[['Potência hidráulica',`${format(1000*9.81*q*v.head/1000)} kW`],['Equivalente',`${format(kw*1.341)} cv`],['Custo mensal energia',money(kw*v.hours*v.energyCost)]]); }
    },
    pumpHead: {
      fields: () => [field('staticHead','Desnível geométrico','m',25),field('frictionLoss','Perdas por atrito','mca',8),field('minorLoss','Perdas locais','mca',3),field('residualPressure','Pressão residual','mca',10)],
      calculate: (v) => { const total=v.staticHead+v.frictionLoss+v.minorLoss+v.residualPressure; return result('AMT necessária',`${format(total)} mca`,[['Desnível',`${format(v.staticHead)} m`],['Atrito + locais',`${format(v.frictionLoss+v.minorLoss)} mca`],['Pressão residual',`${format(v.residualPressure)} mca`]]); }
    },
    reservoirAutonomy: {
      fields: () => [field('dailyConsumption','Consumo diário','m³/dia',35),field('autonomy','Autonomia','dias',2),field('reserve','Reserva técnica','%',20),field('fireReserve','Reserva incêndio','m³',0)],
      calculate: (v) => { const vol=v.dailyConsumption*v.autonomy*(1+v.reserve/100)+v.fireReserve; return result('Volume recomendado',`${format(vol)} m³`,[['Consumo no período',`${format(v.dailyConsumption*v.autonomy)} m³`],['Reserva técnica',`${format(v.reserve)} %`],['Em litros',`${format(vol*1000,0)} L`]]); }
    },
    rainwaterHarvest: {
      fields: () => [field('roofArea','Área de captação','m²',600),field('rainfall','Chuva mensal','mm/mês',160),field('runoff','Coeficiente de escoamento','%',85),field('efficiency','Eficiência filtros/perdas','%',80)],
      calculate: (v) => { const m3=v.roofArea*v.rainfall/1000*v.runoff/100*v.efficiency/100; return result('Captação mensal',`${format(m3)} m³`,[['Captação em litros',`${format(m3*1000,0)} L`],['Área',`${format(v.roofArea)} m²`],['Chuva',`${format(v.rainfall)} mm`]]); }
    },
    fireReserve: {
      fields: () => [field('flow','Vazão de combate','L/min',1000),field('duration','Duração requerida','min',60),field('reserve','Reserva técnica','%',10)],
      calculate: (v) => { const liters=v.flow*v.duration*(1+v.reserve/100); return result('Reserva de incêndio',`${format(liters/1000)} m³`,[['Volume em litros',`${format(liters,0)} L`],['Vazão',`${format(v.flow,0)} L/min`],['Duração',`${format(v.duration,0)} min`]], 'Verificar projeto de proteção contra incêndio e exigências locais.'); }
    },
    sprinklerFlow: {
      fields: () => [field('kFactor','Coeficiente K','L/min/√bar',80),field('pressure','Pressão','bar',1.5),field('heads','Quantidade de pontos','un',8)],
      calculate: (v) => { const one=v.kFactor*Math.sqrt(Math.max(v.pressure,0)); return result('Vazão total',`${format(one*v.heads)} L/min`,[['Vazão por ponto',`${format(one)} L/min`],['Pressão',`${format(v.pressure)} bar`],['Pontos',`${format(v.heads,0)} un`]]); }
    },
    manningChannel: {
      fields: () => [field('width','Largura do canal','m',0.6),field('depth','Lâmina d’água','m',0.35),field('slope','Declividade','m/m',0.005),field('manningN','Coeficiente Manning n','n',0.015)],
      calculate: (v) => { const area=v.width*v.depth, per=v.width+2*v.depth, r=area/Math.max(per,.001); const q=(1/Math.max(v.manningN,.001))*area*Math.pow(r,2/3)*Math.sqrt(Math.max(v.slope,0)); return result('Vazão do canal',`${format(q*1000)} L/s`,[['Velocidade',`${format(q/Math.max(area,.001))} m/s`],['Área molhada',`${format(area)} m²`],['Raio hidráulico',`${format(r)} m`]]); }
    },
    gutterCapacity: {
      fields: () => [field('roofArea','Área de contribuição','m²',450),field('rainIntensity','Intensidade chuva','mm/h',150),field('downspoutCapacity','Capacidade por descida','L/s',6)],
      calculate: (v) => { const q=v.roofArea*v.rainIntensity/3600; const down=ceil(q/Math.max(v.downspoutCapacity,.1)); return result('Vazão de chuva',`${format(q)} L/s`,[['Descidas necessárias',`${down} un`],['Área contribuinte',`${format(v.roofArea)} m²`],['Intensidade',`${format(v.rainIntensity)} mm/h`]]); }
    },
    downspoutCount: {
      fields: () => [field('flow','Vazão total','L/s',24),field('capacity','Capacidade por condutor','L/s',5),field('reserve','Reserva','%',20)],
      calculate: (v) => { const req=v.flow*(1+v.reserve/100); return result('Condutores necessários',`${ceil(req/Math.max(v.capacity,.1))} un`,[['Vazão com reserva',`${format(req)} L/s`],['Capacidade unitária',`${format(v.capacity)} L/s`]]); }
    },
    hydrostaticPressure: {
      fields: () => [field('fluidDensity','Densidade do líquido','kg/m³',1000),field('height','Altura do líquido','m',3),field('wallWidth','Largura da parede','m',2)],
      calculate: (v) => { const p=v.fluidDensity*9.81*v.height/1000; const force=0.5*v.fluidDensity*9.81*v.height*v.height*v.wallWidth/1000; return result('Pressão no fundo',`${format(p)} kPa`,[['Força na parede',`${format(force)} kN`],['Altura do líquido',`${format(v.height)} m`],['Densidade',`${format(v.fluidDensity,0)} kg/m³`]]); }
    },
    hydraulicCylinder: {
      fields: () => [field('pressure','Pressão','bar',180),field('pistonDiameter','Diâmetro pistão','mm',80),field('rodDiameter','Diâmetro haste','mm',45),field('efficiency','Eficiência','%',90)],
      calculate: (v) => { const p=v.pressure*100000,a1=Math.PI*(v.pistonDiameter/1000)**2/4,a2=a1-Math.PI*(v.rodDiameter/1000)**2/4; return result('Força de avanço',`${format(p*a1*v.efficiency/100/1000)} kN`,[['Força de retorno',`${format(p*a2*v.efficiency/100/1000)} kN`],['Área do pistão',`${format(a1*10000)} cm²`],['Pressão',`${format(v.pressure)} bar`]]); }
    },
    torquePower: {
      fields: () => [field('power','Potência','kW',15),field('rpm','Rotação','rpm',1750),field('efficiency','Rendimento','%',95)],
      calculate: (v) => { const t=9550*v.power*Math.max(v.efficiency/100,.01)/Math.max(v.rpm,.01); return result('Torque no eixo',`${format(t)} N·m`,[['Potência',`${format(v.power)} kW`],['Rotação',`${format(v.rpm,0)} rpm`],['Rendimento aplicado',`${format(v.efficiency)} %`]]); }
    },
    beltConveyor: {
      fields: () => [field('beltWidth','Largura da correia','m',0.8),field('speed','Velocidade','m/s',1.5),field('sectionArea','Área da seção material','m²',0.06),field('density','Densidade material','t/m³',1.6),field('efficiency','Eficiência','%',85)],
      calculate: (v) => { const tph=v.speed*v.sectionArea*v.density*3600*v.efficiency/100; return result('Capacidade',`${format(tph)} t/h`,[['Volume por hora',`${format(v.speed*v.sectionArea*3600)} m³/h`],['Densidade',`${format(v.density)} t/m³`],['Eficiência',`${format(v.efficiency)} %`]]); }
    },
    hoistWinch: {
      fields: () => [field('load','Carga','kg',2500),field('height','Altura','m',18),field('speed','Velocidade de içamento','m/min',6),field('efficiency','Eficiência','%',75),field('hourCost','Custo equipamento','R$/h',180)],
      calculate: (v) => { const min=v.height/Math.max(v.speed,.01); const kw=v.load*9.81*(v.speed/60)/Math.max(v.efficiency/100,.01)/1000; return result('Tempo por ciclo',`${format(min)} min`,[['Potência estimada',`${format(kw)} kW`],['Custo por ciclo',money(min/60*v.hourCost)],['Carga',`${format(v.load,0)} kg`]]); }
    },
    compressorDemand: {
      fields: () => [field('tools','Ferramentas simultâneas','un',6),field('airPerTool','Consumo por ferramenta','pcm',18),field('duty','Fator de uso','%',70),field('leaks','Perdas/vazamentos','%',15),field('reserve','Reserva','%',20)],
      calculate: (v) => { const pcm=v.tools*v.airPerTool*v.duty/100*(1+v.leaks/100)*(1+v.reserve/100); return result('Vazão requerida',`${format(pcm)} pcm`,[['Ferramentas',`${format(v.tools,0)} un`],['Fator de uso',`${format(v.duty)} %`],['Com perdas e reserva',`${format(pcm)} pcm`]]); }
    },
    fanAirflow: {
      fields: () => [field('volume','Volume do ambiente','m³',1500),field('airChanges','Renovações por hora','ACH',8),field('staticPressure','Pressão estática','Pa',250),field('efficiency','Rendimento ventilador','%',60)],
      calculate: (v) => { const flow=v.volume*v.airChanges; const kw=(flow/3600)*v.staticPressure/Math.max(v.efficiency/100,.01)/1000; return result('Vazão de ar',`${format(flow)} m³/h`,[['Potência aproximada',`${format(kw)} kW`],['Renovações',`${format(v.airChanges)} ACH`],['Pressão estática',`${format(v.staticPressure)} Pa`]]); }
    },
    bearingLife: {
      fields: () => [field('dynamicCapacity','Capacidade dinâmica C','kN',45),field('equivalentLoad','Carga equivalente P','kN',8),field('rpm','Rotação','rpm',900),field('exponent','Expoente','p',3)],
      calculate: (v) => { const mrev=Math.pow(v.dynamicCapacity/Math.max(v.equivalentLoad,.001),v.exponent); const hours=mrev*1e6/Math.max(60*v.rpm,.001); return result('Vida L10',`${format(hours,0)} h`,[['Milhões de rotações',`${format(mrev)} Mrev`],['Rotação',`${format(v.rpm,0)} rpm`],['Relação C/P',`${format(v.dynamicCapacity/v.equivalentLoad)}`]]); }
    },
    weldingConsumption: {
      fields: () => [field('weldLength','Comprimento de solda','m',120),field('legSize','Cateto/garganta equivalente','mm',6),field('depositionFactor','Fator deposição','kg/m/mm²',0.00008),field('efficiency','Eficiência consumível','%',85),field('wireCost','Custo consumível','R$/kg',28)],
      calculate: (v) => { const kg=v.weldLength*v.legSize*v.legSize*v.depositionFactor/Math.max(v.efficiency/100,.01); return result('Consumível de solda',`${format(kg)} kg`,[['Comprimento',`${format(v.weldLength)} m`],['Cateto',`${format(v.legSize)} mm`],['Custo estimado',money(kg*v.wireCost)]]); }
    },
    airLeakCost: {
      fields: () => [field('leakDiameter','Diâmetro do vazamento','mm',2),field('pressure','Pressão','bar',7),field('hoursMonth','Horas por mês','h',720),field('costPerKwh','Custo energia','R$/kWh',0.85),field('kwPerM3min','Potência específica','kW/(m³/min)',7)],
      calculate: (v) => { const flow=0.012*Math.pow(v.leakDiameter,2)*Math.sqrt(v.pressure); const kw=flow*v.kwPerM3min; return result('Vazão perdida',`${format(flow)} m³/min`,[['Potência desperdiçada',`${format(kw)} kW`],['Custo mensal',money(kw*v.hoursMonth*v.costPerKwh)],['Horas/mês',`${format(v.hoursMonth,0)} h`]]); }
    },
    plateWeight: {
      fields: () => [field('length','Comprimento','m',2),field('width','Largura','m',1),field('thickness','Espessura','mm',6.35),field('density','Densidade','kg/m³',7850),field('costKg','Custo','R$/kg',8)],
      calculate: (v) => { const kg=v.length*v.width*(v.thickness/1000)*v.density; return result('Peso da chapa',`${format(kg)} kg`,[['Área',`${format(v.length*v.width)} m²`],['Espessura',`${format(v.thickness)} mm`],['Custo estimado',money(kg*v.costKg)]]); }
    },
    incidentRate: {
      fields: () => [field('incidents','Acidentes/ocorrências','un',2),field('lostDays','Dias perdidos','dias',12),field('hoursWorked','Horas trabalhadas','h',180000)],
      calculate: (v) => { const tf=v.incidents*1_000_000/Math.max(v.hoursWorked,1); const tg=v.lostDays*1_000_000/Math.max(v.hoursWorked,1); return result('Taxa de frequência',`${format(tf)}`,[['Taxa de gravidade',`${format(tg)}`],['Horas trabalhadas',`${format(v.hoursWorked,0)} h`],['Ocorrências',`${format(v.incidents,0)} un`]], 'Indicador estatístico. Critérios oficiais devem seguir a política de SST e normas aplicáveis.'); }
    },
    heatStress: {
      fields: () => [field('temperature','Temperatura do ar','°C',34),field('humidity','Umidade relativa','%',65),field('activityFactor','Fator atividade','0-10',6),field('sunExposure','Exposição ao sol','0-10',5)],
      calculate: (v) => { const index=v.temperature+0.05*v.humidity+0.4*v.activityFactor+0.35*v.sunExposure; const risk=index<35?'Moderado':index<40?'Alto':'Crítico'; return result('Índice térmico simplificado',`${format(index)} pontos`,[['Classificação',risk],['Temperatura',`${format(v.temperature)} °C`],['Umidade',`${format(v.humidity)} %`]], 'Triagem preliminar. Avaliação oficial de calor exige metodologia e instrumentos adequados.'); }
    },
    noiseDose: {
      fields: () => [field('noiseLevel','Nível de ruído','dB(A)',92),field('exposureHours','Tempo de exposição','h',4),field('limitLevel','Nível base','dB(A)',85),field('exchangeRate','Taxa de troca','dB',5)],
      calculate: (v) => { const allowed=8/Math.pow(2,(v.noiseLevel-v.limitLevel)/Math.max(v.exchangeRate,.1)); const dose=v.exposureHours/Math.max(allowed,.001)*100; return result('Dose de ruído',`${format(dose)} %`,[['Tempo permitido estimado',`${format(allowed)} h`],['Exposição informada',`${format(v.exposureHours)} h`],['Status',dose<=100?'Dentro do limite informado':'Acima do limite informado']], 'Triagem simplificada. Avaliação ocupacional deve seguir dosimetria e laudo técnico.'); }
    },
    confinedVentilation: {
      fields: () => [field('volume','Volume do espaço','m³',180),field('airChanges','Trocas de ar desejadas','ACH',6),field('purgeChanges','Trocas para purga','un',5),field('fanFlow','Vazão do ventilador','m³/h',2500)],
      calculate: (v) => { const req=v.volume*v.airChanges; const purge=v.volume*v.purgeChanges/Math.max(v.fanFlow,.1)*60; return result('Vazão mínima',`${format(req)} m³/h`,[['Tempo de purga',`${format(purge)} min`],['Volume',`${format(v.volume)} m³`],['Ventilador informado',`${format(v.fanFlow)} m³/h`]], 'Espaço confinado exige permissão, monitoramento atmosférico, resgate e normas aplicáveis.'); }
    },
    fireExtinguishers: {
      fields: () => [field('area','Área protegida','m²',1000),field('coverage','Cobertura por extintor','m²/un',250),field('riskFactor','Fator de risco','x',1.2)],
      calculate: (v) => { const qty=ceil(v.area/Math.max(v.coverage,.1)*v.riskFactor); return result('Extintores preliminares',`${qty} un`,[['Área',`${format(v.area)} m²`],['Cobertura adotada',`${format(v.coverage)} m²/un`],['Fator de risco',`${format(v.riskFactor)} x`]], 'Verificar projeto de incêndio, classe de risco, tipo de agente e exigência local.'); }
    },
    ppeStock: {
      fields: () => [field('workers','Colaboradores','un',80),field('consumptionPerWorker','Consumo mensal por pessoa','un/mês',1.2),field('leadTime','Lead time','dias',20),field('safetyStock','Estoque segurança','dias',15),field('currentStock','Estoque atual','un',120)],
      calculate: (v) => { const daily=v.workers*v.consumptionPerWorker/30; const pr=daily*(v.leadTime+v.safetyStock); const buy=Math.max(0,ceil(pr-v.currentStock)); return result('Ponto de reposição',`${format(pr,0)} un`,[['Consumo diário',`${format(daily)} un/dia`],['Compra sugerida',`${buy} un`],['Cobertura atual',`${format(v.currentStock/Math.max(daily,.001))} dias`]]); }
    },
    fallClearance: {
      fields: () => [field('lanyard','Talabarte/conexão','m',1.5),field('deceleration','Distância de desaceleração','m',1.2),field('workerHeight','Altura trabalhador','m',1.8),field('safetyMargin','Margem de segurança','m',1)],
      calculate: (v) => { const c=v.lanyard+v.deceleration+v.workerHeight+v.safetyMargin; return result('Zona livre mínima',`${format(c)} m`,[['Conexão',`${format(v.lanyard)} m`],['Desaceleração',`${format(v.deceleration)} m`],['Margem',`${format(v.safetyMargin)} m`]], 'Verificar manual do fabricante, ancoragem, absorvedor, trava-queda e plano de resgate.'); }
    },
    evacuationTime: {
      fields: () => [field('people','População','pessoas',250),field('exitCapacity','Capacidade de saída','pessoas/min',80),field('travelTime','Tempo de deslocamento','min',3),field('safetyFactor','Fator de segurança','%',20)],
      calculate: (v) => { const time=(v.people/Math.max(v.exitCapacity,.1)+v.travelTime)*(1+v.safetyFactor/100); return result('Tempo estimado de evacuação',`${format(time)} min`,[['Tempo de fila',`${format(v.people/Math.max(v.exitCapacity,.1))} min`],['Deslocamento',`${format(v.travelTime)} min`],['População',`${format(v.people,0)} pessoas`]]); }
    },
    trainingHours: {
      fields: () => [field('workers','Colaboradores','un',120),field('hoursPerWorker','Carga horária por pessoa','h',4),field('classSize','Tamanho da turma','pessoas',25),field('instructorCostHour','Custo instrutor','R$/h',180)],
      calculate: (v) => { const hh=v.workers*v.hoursPerWorker; const classes=ceil(v.workers/Math.max(v.classSize,1)); return result('Horas-homem de treinamento',`${format(hh)} h`,[['Turmas necessárias',`${classes} un`],['Horas de instrutor',`${format(classes*v.hoursPerWorker)} h`],['Custo instrutor',money(classes*v.hoursPerWorker*v.instructorCostHour)]]); }
    },
    riskMatrix: {
      fields: () => [field('probability','Probabilidade','1-5',3),field('severity','Severidade','1-5',4),field('exposure','Exposição','1-5',3)],
      calculate: (v) => { const score=v.probability*v.severity*v.exposure; const level=score<=15?'Baixo':score<=40?'Médio':score<=75?'Alto':'Crítico'; return result('Nível de risco',level,[['Pontuação',`${format(score,0)}`],['Probabilidade',`${format(v.probability,0)}`],['Severidade',`${format(v.severity,0)}`],['Exposição',`${format(v.exposure,0)}`]]); }
    },
    firstAidKits: {
      fields: () => [field('workers','Colaboradores','un',120),field('fronts','Frentes de trabalho','un',4),field('workersPerKit','Pessoas por kit','pessoas/kit',25)],
      calculate: (v) => { const kits=Math.max(ceil(v.workers/Math.max(v.workersPerKit,1)),ceil(v.fronts)); return result('Kits necessários',`${kits} un`,[['Por efetivo',`${ceil(v.workers/Math.max(v.workersPerKit,1))} un`],['Por frentes',`${ceil(v.fronts)} un`],['Colaboradores',`${format(v.workers,0)} un`]]); }
    },
    assemblyArea: {
      fields: () => [field('people','Pessoas','un',300),field('areaPerPerson','Área por pessoa','m²/pessoa',0.8),field('reserve','Reserva','%',25)],
      calculate: (v) => { const area=v.people*v.areaPerPerson*(1+v.reserve/100); return result('Área do ponto de encontro',`${format(area)} m²`,[['População',`${format(v.people,0)} pessoas`],['Área unitária',`${format(v.areaPerPerson)} m²/pessoa`],['Reserva',`${format(v.reserve)} %`]]); }
    },
    oee: {
      fields: () => [field('plannedTime','Tempo planejado','h',160),field('downtime','Paradas','h',18),field('idealRate','Produção ideal','un/h',100),field('actualOutput','Produção real','un',12000),field('scrap','Refugo/retrabalho','un',450)],
      calculate: (v) => { const op=Math.max(v.plannedTime-v.downtime,0); const av=op/Math.max(v.plannedTime,.001); const perf=v.actualOutput/Math.max(op*v.idealRate,.001); const qual=(v.actualOutput-v.scrap)/Math.max(v.actualOutput,.001); return result('OEE',`${format(av*perf*qual*100)} %`,[['Disponibilidade',`${format(av*100)} %`],['Performance',`${format(perf*100)} %`],['Qualidade',`${format(qual*100)} %`]]); }
    },
    taktTime: {
      fields: () => [field('availableTime','Tempo disponível','min/dia',480),field('demand','Demanda diária','un/dia',120),field('cycleTime','Tempo de ciclo atual','min/un',5)],
      calculate: (v) => { const takt=v.availableTime/Math.max(v.demand,.001); const stations=ceil(v.cycleTime/Math.max(takt,.001)); return result('Takt time',`${format(takt)} min/un`,[['Postos necessários',`${stations} un`],['Ciclo atual',`${format(v.cycleTime)} min/un`],['Demanda',`${format(v.demand,0)} un/dia`]]); }
    },
    downtimeCost: {
      fields: () => [field('downtimeHours','Horas paradas','h',12),field('lostProductionHour','Produção perdida','un/h',80),field('marginPerUnit','Margem por unidade','R$/un',35),field('fixedCostHour','Custo fixo hora','R$/h',450)],
      calculate: (v) => { const cost=v.downtimeHours*(v.lostProductionHour*v.marginPerUnit+v.fixedCostHour); return result('Custo da parada',money(cost),[['Produção perdida',`${format(v.downtimeHours*v.lostProductionHour,0)} un`],['Margem perdida',money(v.downtimeHours*v.lostProductionHour*v.marginPerUnit)],['Custo fixo',money(v.downtimeHours*v.fixedCostHour)]]); }
    },
    maintenancePlan: {
      fields: () => [field('equipment','Equipamentos','un',18),field('pmHours','Horas por preventiva','h',3),field('frequencyMonth','Preventivas por mês','un/mês',2),field('laborCostHour','Custo mão de obra','R$/h',95),field('partsCostPM','Peças por preventiva','R$/un',180)],
      calculate: (v) => { const hours=v.equipment*v.pmHours*v.frequencyMonth; const cost=hours*v.laborCostHour+v.equipment*v.frequencyMonth*v.partsCostPM; return result('Horas mensais de preventiva',`${format(hours)} h`,[['Preventivas/mês',`${format(v.equipment*v.frequencyMonth,0)} un`],['Custo mensal',money(cost)],['Custo anual',money(cost*12)]]); }
    },
    sparePartsROP: {
      fields: () => [field('monthlyConsumption','Consumo mensal','un/mês',40),field('leadTime','Lead time','dias',45),field('safetyStock','Estoque segurança','dias',20),field('currentStock','Estoque atual','un',70),field('lotSize','Lote de compra','un',10)],
      calculate: (v) => { const daily=v.monthlyConsumption/30; const pr=daily*(v.leadTime+v.safetyStock); const buy=Math.max(0,ceil((pr-v.currentStock)/Math.max(v.lotSize,1))*v.lotSize); return result('Ponto de reposição',`${format(pr,0)} un`,[['Consumo diário',`${format(daily)} un/dia`],['Compra sugerida',`${buy} un`],['Cobertura atual',`${format(v.currentStock/Math.max(daily,.001))} dias`]]); }
    },
    inventoryCoverage: {
      fields: () => [field('stock','Estoque atual','un',850),field('monthlyConsumption','Consumo mensal','un/mês',300),field('unitCost','Custo unitário','R$/un',45)],
      calculate: (v) => { const days=v.stock/Math.max(v.monthlyConsumption/30,.001); return result('Cobertura de estoque',`${format(days)} dias`,[['Valor em estoque',money(v.stock*v.unitCost)],['Consumo diário',`${format(v.monthlyConsumption/30)} un/dia`],['Meses de cobertura',`${format(days/30)} meses`]]); }
    },
    forkliftProductivity: {
      fields: () => [field('cycleTime','Tempo por ciclo','min',4.5),field('palletsPerCycle','Paletes por ciclo','un',1),field('efficiency','Eficiência','%',80),field('hoursDay','Horas por dia','h',8),field('hourCost','Custo hora','R$/h',120)],
      calculate: (v) => { const ph=60/Math.max(v.cycleTime,.01)*v.palletsPerCycle*v.efficiency/100; return result('Produtividade',`${format(ph)} paletes/h`,[['Paletes/dia',`${format(ph*v.hoursDay,0)} un`],['Custo por palete',money(v.hourCost/Math.max(ph,.001))],['Custo diário',money(v.hourCost*v.hoursDay)]]); }
    },
    warehouseCapacity: {
      fields: () => [field('area','Área do armazém','m²',1200),field('aisleFactor','Fator útil','%',55),field('palletFootprint','Área por palete','m²',1.2),field('levels','Níveis verticais','un',3),field('occupancy','Ocupação operacional','%',85)],
      calculate: (v) => { const pos=v.area*v.aisleFactor/100/Math.max(v.palletFootprint,.001)*v.levels*v.occupancy/100; return result('Capacidade operacional',`${format(pos,0)} posições`,[['Área útil',`${format(v.area*v.aisleFactor/100)} m²`],['Níveis',`${format(v.levels,0)} un`],['Ocupação',`${format(v.occupancy)} %`]]); }
    },
    industrialWaterDemand: {
      fields: () => [field('processFlow','Consumo de processo','m³/h',12),field('utilityFlow','Utilidades','m³/h',3),field('hoursDay','Horas por dia','h',16),field('loss','Perdas','%',8),field('autonomy','Autonomia','dias',1)],
      calculate: (v) => { const daily=(v.processFlow+v.utilityFlow)*v.hoursDay*(1+v.loss/100); return result('Demanda diária',`${format(daily)} m³/dia`,[['Reservação sugerida',`${format(daily*v.autonomy)} m³`],['Vazão total',`${format(v.processFlow+v.utilityFlow)} m³/h`],['Perdas',`${format(v.loss)} %`]]); }
    },
    compressedAirNetwork: {
      fields: () => [field('baseDemand','Demanda base','pcm',250),field('simultaneity','Simultaneidade','%',75),field('leakAllowance','Perdas/vazamentos','%',15),field('reserve','Reserva','%',20)],
      calculate: (v) => { const pcm=v.baseDemand*v.simultaneity/100*(1+v.leakAllowance/100)*(1+v.reserve/100); return result('Capacidade do compressor',`${format(pcm)} pcm`,[['Demanda simultânea',`${format(v.baseDemand*v.simultaneity/100)} pcm`],['Perdas',`${format(v.leakAllowance)} %`],['Reserva',`${format(v.reserve)} %`]]); }
    },
    earnedValue: {
      fields: () => [field('plannedValue','Valor planejado PV','R$',500000),field('earnedValue','Valor agregado EV','R$',430000),field('actualCost','Custo real AC','R$',470000)],
      calculate: (v) => { const cpi=v.earnedValue/Math.max(v.actualCost,.001), spi=v.earnedValue/Math.max(v.plannedValue,.001); return result('CPI / SPI',`${format(cpi,2)} / ${format(spi,2)}`,[['Variação de custo CV',money(v.earnedValue-v.actualCost)],['Variação de prazo SV',money(v.earnedValue-v.plannedValue)],['Status custo',cpi>=1?'Dentro do custo':'Acima do custo']]); }
    },
    workingDays: {
      fields: () => [field('calendarDays','Dias corridos','dias',120),field('weekendDays','Finais de semana','dias',34),field('holidays','Feriados/paradas','dias',6),field('weatherLoss','Perdas climáticas','dias',8)],
      calculate: (v) => { const working=Math.max(v.calendarDays-v.weekendDays-v.holidays-v.weatherLoss,0); return result('Dias úteis efetivos',`${format(working,0)} dias`,[['Dias corridos',`${format(v.calendarDays,0)} dias`],['Paradas totais',`${format(v.weekendDays+v.holidays+v.weatherLoss,0)} dias`],['Eficiência calendário',`${format(working/Math.max(v.calendarDays,.001)*100)} %`]]); }
    },
    crewSizing: {
      fields: () => [field('quantity','Quantidade do serviço','un',1200),field('productivity','Produtividade por pessoa/dia','un/dia',18),field('deadline','Prazo disponível','dias',15),field('efficiency','Eficiência','%',85)],
      calculate: (v) => { const people=ceil(v.quantity/Math.max(v.productivity*v.deadline*v.efficiency/100,.001)); return result('Equipe necessária',`${people} pessoas`,[['Produção diária necessária',`${format(v.quantity/v.deadline)} un/dia`],['Produtividade ajustada',`${format(v.productivity*v.efficiency/100)} un/dia`],['Prazo',`${format(v.deadline,0)} dias`]]); }
    },
    procurementLeadTime: {
      fields: () => [field('daysUntilNeed','Dias até necessidade','dias',60),field('leadTime','Lead time fornecedor','dias',35),field('approvalTime','Tempo aprovação/compras','dias',10),field('safetyMargin','Margem segurança','dias',7)],
      calculate: (v) => { const need=v.leadTime+v.approvalTime+v.safetyMargin; const slack=v.daysUntilNeed-need; return result('Folga de suprimentos',`${format(slack,0)} dias`,[['Prazo mínimo para comprar',`${format(need,0)} dias antes`],['Status',slack>=0?'Dentro do prazo':'Comprar com urgência'],['Atraso potencial',`${format(Math.max(-slack,0),0)} dias`]]); }
    },
    cashFlowMonthly: {
      fields: () => [field('totalCost','Custo total','R$',2500000),field('months','Prazo','meses',10),field('frontLoad','Mobilização inicial','%',12),field('retention','Retenção','%',5)],
      calculate: (v) => { const initial=v.totalCost*v.frontLoad/100; const monthly=(v.totalCost-initial)/Math.max(v.months,.1); const retention=v.totalCost*v.retention/100; return result('Desembolso médio mensal',money(monthly),[['Mobilização inicial',money(initial)],['Retenção contratual',money(retention)],['Prazo',`${format(v.months,0)} meses`]]); }
    },
    contingencyRisk: {
      fields: () => [field('baseBudget','Orçamento base','R$',1800000),field('probability','Probabilidade média','%',35),field('impact','Impacto estimado','%',12),field('managementFactor','Fator gerencial','x',1.2)],
      calculate: (v) => { const reserve=v.baseBudget*v.probability/100*v.impact/100*v.managementFactor; return result('Reserva de contingência',money(reserve),[['Percentual sobre orçamento',`${format(reserve/Math.max(v.baseBudget,.001)*100)} %`],['Probabilidade',`${format(v.probability)} %`],['Impacto',`${format(v.impact)} %`]]); }
    },
    dailyProductionKPI: {
      fields: () => [field('planned','Planejado no dia','un',100),field('realized','Realizado no dia','un',86),field('accumulatedPlanned','Planejado acumulado','un',1200),field('accumulatedRealized','Realizado acumulado','un',1100)],
      calculate: (v) => { const day=v.realized/Math.max(v.planned,.001)*100; const acc=v.accumulatedRealized/Math.max(v.accumulatedPlanned,.001)*100; return result('Aderência diária',`${format(day)} %`,[['Aderência acumulada',`${format(acc)} %`],['Desvio do dia',`${format(v.realized-v.planned)} un`],['Desvio acumulado',`${format(v.accumulatedRealized-v.accumulatedPlanned)} un`]]); }
    },
    resourceLeveling: {
      fields: () => [field('fronts','Frentes de trabalho','un',4),field('crewPerFront','Equipe por frente','pessoas',8),field('availableWorkers','Efetivo disponível','pessoas',28),field('productivityLoss','Perda por redistribuição','%',8)],
      calculate: (v) => { const need=v.fronts*v.crewPerFront, deficit=Math.max(0,need-v.availableWorkers); const prod=Math.min(100,v.availableWorkers/Math.max(need,.001)*100)*(1-v.productivityLoss/100); return result('Necessidade de efetivo',`${format(need,0)} pessoas`,[['Déficit',`${format(deficit,0)} pessoas`],['Produtividade ajustada',`${format(prod)} %`],['Efetivo disponível',`${format(v.availableWorkers,0)} pessoas`]]); }
    },
    siteWaterConsumption: {
      fields: () => [field('workers','Colaboradores','pessoas',120),field('litersPerWorker','Consumo por pessoa','L/dia',80),field('cleaning','Limpeza/apoio','L/dia',3000),field('curing','Cura de concreto','L/dia',1500),field('autonomy','Autonomia','dias',2)],
      calculate: (v) => { const daily=v.workers*v.litersPerWorker+v.cleaning+v.curing; return result('Consumo diário do canteiro',`${format(daily/1000)} m³/dia`,[['Reservação sugerida',`${format(daily*v.autonomy/1000)} m³`],['Consumo pessoal',`${format(v.workers*v.litersPerWorker,0)} L/dia`],['Apoio/limpeza/cura',`${format(v.cleaning+v.curing,0)} L/dia`]]); }
    },
    sanitaryFacilities: {
      fields: () => [field('workers','Colaboradores','pessoas',120),field('peoplePerToilet','Pessoas por sanitário','pessoas/un',20),field('peoplePerShower','Pessoas por chuveiro','pessoas/un',40),field('peoplePerSink','Pessoas por lavatório','pessoas/un',20)],
      calculate: (v) => result('Sanitários necessários',`${ceil(v.workers/Math.max(v.peoplePerToilet,1))} un`,[['Chuveiros',`${ceil(v.workers/Math.max(v.peoplePerShower,1))} un`],['Lavatórios',`${ceil(v.workers/Math.max(v.peoplePerSink,1))} un`],['Efetivo',`${format(v.workers,0)} pessoas`]], 'Verificar exigências da NR-18/NR-24 e condições específicas do canteiro.')
    },
    siteFence: {
      fields: () => [field('perimeter','Perímetro do canteiro','m',450),field('panelLength','Comprimento do painel','m',2.2),field('gates','Portões','un',3),field('loss','Perdas/reserva','%',8),field('panelCost','Custo painel','R$/un',95)],
      calculate: (v) => { const panels=ceil(v.perimeter/Math.max(v.panelLength,.1)*(1+v.loss/100)); return result('Painéis de tapume/cerca',`${panels} un`,[['Portões',`${format(v.gates,0)} un`],['Perímetro',`${format(v.perimeter)} m`],['Custo estimado',money(panels*v.panelCost)]]); }
    },
    temporaryRoad: {
      fields: () => [field('length','Comprimento do acesso','m',300),field('width','Largura','m',5),field('thickness','Espessura brita','cm',15),field('loss','Perdas/compactação','%',10),field('gravelCost','Custo brita','R$/m³',145)],
      calculate: (v) => { const vol=v.length*v.width*v.thickness/100*(1+v.loss/100); return result('Brita necessária',`${format(vol)} m³`,[['Área do acesso',`${format(v.length*v.width)} m²`],['Espessura',`${format(v.thickness)} cm`],['Custo estimado',money(vol*v.gravelCost)]]); }
    },
    yardLighting: {
      fields: () => [field('area','Área do pátio','m²',5000),field('targetLux','Iluminância desejada','lux',50),field('luminaireLumens','Fluxo por projetor','lm',30000),field('utilization','Fator utilização','%',55),field('maintenance','Fator manutenção','%',80)],
      calculate: (v) => { const lum=v.area*v.targetLux/Math.max((v.utilization/100)*(v.maintenance/100),.001); const qty=ceil(lum/Math.max(v.luminaireLumens,1)); return result('Projetores necessários',`${qty} un`,[['Fluxo requerido',`${format(lum,0)} lm`],['Área',`${format(v.area)} m²`],['Lux desejado',`${format(v.targetLux)} lux`]]); }
    },
    dustControlWater: {
      fields: () => [field('area','Área a umectar','m²',12000),field('applicationRate','Taxa de aplicação','L/m²',1.5),field('applicationsDay','Aplicações por dia','un',3),field('truckCapacity','Capacidade caminhão-pipa','L',20000),field('tripCost','Custo por viagem','R$/viagem',380)],
      calculate: (v) => { const liters=v.area*v.applicationRate*v.applicationsDay; const trips=ceil(liters/Math.max(v.truckCapacity,1)); return result('Água por dia',`${format(liters/1000)} m³/dia`,[['Viagens por dia',`${trips} un`],['Capacidade caminhão',`${format(v.truckCapacity,0)} L`],['Custo diário',money(trips*v.tripCost)]]); }
    }
  };

  function professionalSpec(calc) {
    return professionalFormulaSpecs[calc.config.kind] || professionalFormulaSpecs.crewSizing;
  }


  const templates = {
    professionalFormula: {
      fields: (calc) => professionalSpec(calc).fields(calc),
      calculate: (v, calc) => professionalSpec(calc).calculate(v, calc)
    },
    roof: {
      fields: (calc) => [
        field('length', 'Comprimento da cobertura', 'm', 10),
        field('width', 'Largura projetada', 'm', 8),
        field('pitch', 'Inclinação', '°', 30, 'Ângulo aproximado da água do telhado.'),
        field('overhang', 'Beiral em cada lado', 'm', 0.5),
        field('waste', 'Perdas e recortes', '%', 10),
        field('coverage', 'Rendimento da cobertura', 'un/m²', 10, 'Quantidade de telhas ou peças por metro quadrado.'),
        field('unitCost', 'Custo da cobertura', 'R$/m²', 65),
        field('spacing', 'Espaçamento de vigas/caibros', 'm', 0.6)
      ],
      calculate: (v, calc) => {
        const pitch = clamp(v.pitch, 0, 75) * Math.PI / 180;
        const factor = calc.config.factor || 1;
        const planLength = v.length + 2 * v.overhang;
        const planWidth = v.width + 2 * v.overhang;
        const slopeArea = (planLength * planWidth / Math.max(Math.cos(pitch), 0.25)) * factor;
        const adjusted = slopeArea * (1 + v.waste / 100);
        const halfRun = (v.width / (calc.config.sides === 1 ? 1 : 2)) + v.overhang;
        const rafter = halfRun / Math.max(Math.cos(pitch), 0.25);
        const rafters = ceil(planLength / Math.max(v.spacing, 0.1)) + 1;
        return result('Área de cobertura com perdas', `${format(adjusted)} m²`, [
          ['Área geométrica', `${format(slopeArea)} m²`],
          ['Comprimento inclinado', `${format(rafter)} m`],
          ['Cobertura estimada', `${format(adjusted * v.coverage, 0)} un`],
          ['Linhas de vigas/caibros', `${rafters} un`],
          ['Custo estimado', money(adjusted * v.unitCost)]
        ]);
      }
    },
    stairs: {
      fields: () => [
        field('height', 'Altura piso a piso', 'm', 2.8),
        field('run', 'Comprimento disponível', 'm', 4.2),
        field('width', 'Largura da escada', 'm', 1),
        field('targetRiser', 'Espelho desejado', 'cm', 17.5),
        field('waste', 'Perdas de material', '%', 8),
        field('unitCost', 'Custo de referência', 'R$/m²', 480)
      ],
      calculate: (v, calc) => {
        const steps = Math.max(2, Math.round((v.height * 100) / Math.max(v.targetRiser, 10)));
        const riser = (v.height * 100) / steps;
        const treads = Math.max(1, steps - 1);
        const tread = (v.run * 100) / treads;
        const angle = Math.atan(v.height / Math.max(v.run, .01)) * 180 / Math.PI;
        const stringer = Math.hypot(v.height, v.run) * (calc.config.factor || 1);
        const surface = (treads * (tread / 100) * v.width + steps * (riser / 100) * v.width) * (1 + v.waste / 100);
        const comfort = 2 * riser + tread;
        const status = comfort >= 61 && comfort <= 64 ? 'Confortável' : 'Revisar geometria';
        const concreteVolume = calc.config.concrete ? surface * 0.12 : 0;
        const details = [
          ['Degraus / espelhos', `${steps} un`],
          ['Pisos úteis', `${treads} un`],
          ['Altura do espelho', `${format(riser, 1)} cm`],
          ['Profundidade do piso', `${format(tread, 1)} cm`],
          ['Inclinação', `${format(angle, 1)}°`],
          ['Comprimento inclinado', `${format(stringer)} m`],
          ['Regra 2E + P', `${format(comfort, 1)} cm — ${status}`],
          ['Custo estimado', money(surface * v.unitCost)]
        ];
        if (calc.config.concrete) details.splice(6, 0, ['Concreto aproximado', `${format(concreteVolume)} m³`]);
        return result('Área de acabamento com perdas', `${format(surface)} m²`, details, 'A geometria deve respeitar normas de acessibilidade, circulação, guarda-corpo e segurança. Resultado preliminar.');
      }
    },
    spiralStairs: {
      fields: () => [
        field('height', 'Altura piso a piso', 'm', 2.8),
        field('diameter', 'Diâmetro externo', 'm', 1.8),
        field('core', 'Diâmetro do eixo central', 'm', 0.18),
        field('targetRiser', 'Espelho desejado', 'cm', 18),
        field('turns', 'Número de voltas', 'voltas', 1),
        field('unitCost', 'Custo por degrau', 'R$/un', 320)
      ],
      calculate: (v) => {
        const steps = Math.max(3, Math.round(v.height * 100 / Math.max(v.targetRiser, 10)));
        const riser = v.height * 100 / steps;
        const angle = 360 * v.turns / steps;
        const walkRadius = (v.diameter + v.core) / 4;
        const treadWalk = 2 * Math.PI * walkRadius * v.turns / steps;
        const totalPath = 2 * Math.PI * walkRadius * v.turns;
        return result('Quantidade de degraus', `${steps} un`, [
          ['Altura do espelho', `${format(riser, 1)} cm`],
          ['Ângulo por degrau', `${format(angle, 1)}°`],
          ['Piso na linha de caminhada', `${format(treadWalk * 100, 1)} cm`],
          ['Desenvolvimento helicoidal', `${format(Math.hypot(totalPath, v.height))} m`],
          ['Custo estimado', money(steps * v.unitCost)]
        ], 'Escadas helicoidais exigem verificação detalhada de largura útil, piso mínimo, guarda-corpo e altura livre.');
      }
    },
    stripFoundation: {
      fields: () => [
        field('length', 'Comprimento total', 'm', 48),
        field('width', 'Largura da fundação', 'm', 0.4),
        field('height', 'Altura da fundação', 'm', 0.6),
        field('waste', 'Perdas de concreto', '%', 7),
        field('unitCost', 'Custo do concreto', 'R$/m³', 620),
        field('rebarRate', 'Taxa estimada de aço', 'kg/m³', 70)
      ],
      calculate: (v) => {
        const volume = v.length * v.width * v.height;
        const adjusted = volume * (1 + v.waste / 100);
        return result('Volume de concreto com perdas', `${format(adjusted)} m³`, [
          ['Volume geométrico', `${format(volume)} m³`],
          ['Área de forma lateral', `${format(2 * v.length * v.height)} m²`],
          ['Aço estimado', `${format(adjusted * v.rebarRate, 0)} kg`],
          ['Custo do concreto', money(adjusted * v.unitCost)]
        ], 'Dimensões e armaduras devem ser definidas por projeto geotécnico e estrutural.');
      }
    },
    pileFoundation: {
      fields: () => [
        field('count', 'Quantidade de estacas', 'un', 20),
        field('diameter', 'Diâmetro', 'cm', 30),
        field('depth', 'Profundidade média', 'm', 6),
        field('waste', 'Perdas de concreto', '%', 8),
        field('unitCost', 'Custo do concreto', 'R$/m³', 620),
        field('rebarRate', 'Taxa estimada de aço', 'kg/m³', 90)
      ],
      calculate: (v) => {
        const radius = v.diameter / 200;
        const each = Math.PI * radius ** 2 * v.depth;
        const volume = each * v.count;
        const adjusted = volume * (1 + v.waste / 100);
        return result('Volume total com perdas', `${format(adjusted)} m³`, [
          ['Volume por estaca', `${format(each, 3)} m³`],
          ['Concreto geométrico', `${format(volume)} m³`],
          ['Aço estimado', `${format(adjusted * v.rebarRate, 0)} kg`],
          ['Custo do concreto', money(adjusted * v.unitCost)]
        ], 'Tipo, diâmetro, profundidade e capacidade das estacas dependem de sondagem e projeto estrutural.');
      }
    },
    slab: {
      fields: (calc) => [
        field('length', 'Comprimento', 'm', 10),
        field('width', 'Largura', 'm', 8),
        field('thickness', 'Espessura', calc.config.thin ? 'mm' : 'cm', calc.config.thin ? 5 : 15),
        field('waste', 'Perdas', '%', calc.config.thin ? 10 : 7),
        field('unitCost', 'Custo do material', calc.config.thin ? 'R$/kg' : 'R$/m³', calc.config.thin ? 4.8 : 620),
        field('density', 'Densidade', 'kg/m³', calc.config.thin ? 1800 : 2400)
      ],
      calculate: (v, calc) => {
        const thicknessM = calc.config.thin ? v.thickness / 1000 : v.thickness / 100;
        const area = v.length * v.width;
        const volume = area * thicknessM;
        const adjusted = volume * (1 + v.waste / 100);
        const mass = adjusted * v.density;
        const cost = calc.config.thin ? mass * v.unitCost : adjusted * v.unitCost;
        return result(calc.config.thin ? 'Massa de produto com perdas' : 'Volume de concreto com perdas', calc.config.thin ? `${format(mass, 0)} kg` : `${format(adjusted)} m³`, [
          ['Área', `${format(area)} m²`],
          ['Volume geométrico', `${format(volume, 3)} m³`],
          ['Massa aproximada', `${format(mass, 0)} kg`],
          ['Custo estimado', money(cost)]
        ]);
      }
    },
    ring: {
      fields: () => [
        field('outer', 'Diâmetro externo', 'm', 1.2),
        field('inner', 'Diâmetro interno', 'm', 1),
        field('height', 'Altura do anel', 'm', 0.5),
        field('count', 'Quantidade', 'un', 4),
        field('density', 'Densidade do concreto', 'kg/m³', 2400),
        field('unitCost', 'Custo por m³', 'R$/m³', 780)
      ],
      calculate: (v) => {
        const each = Math.PI * (v.outer ** 2 - v.inner ** 2) / 4 * v.height;
        const total = each * v.count;
        return result('Volume total de concreto', `${format(total, 3)} m³`, [
          ['Volume por anel', `${format(each, 3)} m³`],
          ['Peso por anel', `${format(each * v.density, 0)} kg`],
          ['Peso total', `${format(total * v.density, 0)} kg`],
          ['Custo estimado', money(total * v.unitCost)]
        ]);
      }
    },
    diagonal: {
      fields: () => [
        field('length', 'Comprimento', 'm', 6),
        field('width', 'Largura', 'm', 4),
        field('count', 'Quantidade de peças', 'un', 1),
        field('unitCost', 'Custo por metro', 'R$/m', 45)
      ],
      calculate: (v) => {
        const diag = Math.hypot(v.length, v.width);
        const angle = Math.atan2(v.width, v.length) * 180 / Math.PI;
        return result('Diagonal', `${format(diag)} m`, [
          ['Área retangular', `${format(v.length * v.width)} m²`],
          ['Perímetro', `${format(2 * (v.length + v.width))} m`],
          ['Ângulo', `${format(angle, 1)}°`],
          ['Comprimento total', `${format(diag * v.count)} m`],
          ['Custo estimado', money(diag * v.count * v.unitCost)]
        ]);
      }
    },
    stripArea: {
      fields: () => [
        field('perimeter', 'Perímetro externo', 'm', 40),
        field('width', 'Largura da faixa', 'm', 0.8),
        field('thickness', 'Espessura', 'cm', 8),
        field('waste', 'Perdas', '%', 7),
        field('unitCost', 'Custo do concreto', 'R$/m³', 620)
      ],
      calculate: (v) => {
        const area = v.perimeter * v.width;
        const volume = area * v.thickness / 100;
        const adjusted = volume * (1 + v.waste / 100);
        return result('Volume com perdas', `${format(adjusted)} m³`, [
          ['Área da faixa', `${format(area)} m²`],
          ['Volume geométrico', `${format(volume)} m³`],
          ['Custo estimado', money(adjusted * v.unitCost)]
        ]);
      }
    },
    concreteMix: {
      fields: () => [
        field('volume', 'Volume necessário', 'm³', 10),
        selectField('traceType', 'Tipo de traço', 'padrao', traceOptionsList, 'Escolha o traço pré-definido ou use personalizado.'),
        field('cementPart', 'Cimento — parte', 'parte', 1, 'Usado quando o traço for personalizado.'),
        field('sandPart', 'Areia — parte', 'parte', 2, 'Exemplo: 3 para traço 1:3:3.'),
        field('gravelPart', 'Brita/Pedra — parte', 'parte', 3, 'Exemplo: 3 para traço 1:2:3.'),
        field('dryFactor', 'Fator volume seco', 'x', 1.54, 'Fator usual para converter concreto fresco em volume seco dos insumos.'),
        field('waterCement', 'Relação água/cimento', 'a/c', 0.55, 'Usada no traço personalizado. Nos traços prontos usa a sugestão do traço.'),
        field('waste', 'Perdas', '%', 7),
        field('bagWeight', 'Peso do saco', 'kg', 50),
        field('cementDensity', 'Densidade aparente cimento', 'kg/m³', 1440),
        field('sandBulking', 'Empolamento da areia', '%', 15),
        field('cementBagCost', 'Custo saco de cimento', 'R$/un', 38),
        field('sandCost', 'Custo areia', 'R$/m³', 120),
        field('gravelCost', 'Custo brita', 'R$/m³', 145)
      ],
      calculate: (v) => {
        const trace = concreteTrace(v);
        const totalParts = Math.max(trace.cement + trace.sand + trace.gravel, .01);
        const freshVolume = v.volume * (1 + v.waste / 100);
        const dryVolume = freshVolume * Math.max(v.dryFactor, 1);
        const cementVol = dryVolume * trace.cement / totalParts;
        const sandVol = dryVolume * trace.sand / totalParts;
        const gravelVol = dryVolume * trace.gravel / totalParts;
        const cementKg = cementVol * Math.max(v.cementDensity, 1);
        const bags = ceil(cementKg / Math.max(v.bagWeight, 1));
        const sandPurchase = sandVol * (1 + v.sandBulking / 100);
        const water = cementKg * (trace.waterCement || v.waterCement);
        const cost = bags * v.cementBagCost + sandPurchase * v.sandCost + gravelVol * v.gravelCost;
        const ratioLabel = `${format(trace.cement, trace.cement % 1 ? 1 : 0)}:${format(trace.sand, trace.sand % 1 ? 1 : 0)}:${format(trace.gravel, trace.gravel % 1 ? 1 : 0)}`;
        return result('Volume de concreto com perdas', `${format(freshVolume)} m³`, [
          ['Traço selecionado', `${trace.label.replace(' — ', ' ')}`],
          ['Proporção C:A:B', ratioLabel],
          ['Cimento', `${format(cementKg, 0)} kg`],
          ['Sacos de cimento', `${bags} un`],
          ['Areia para compra', `${format(sandPurchase)} m³`],
          ['Brita/Pedra', `${format(gravelVol)} m³`],
          ['Água estimada', `${format(water, 0)} L`],
          ['Custo estimado', money(cost)]
        ], `${trace.use} Dosagem real deve considerar resistência, abatimento, umidade dos agregados, tipo de cimento e validação do responsável técnico.`);
      }
    },
    wood: {
      fields: () => [
        field('length', 'Comprimento da peça', 'm', 3),
        field('width', 'Largura', 'cm', 15),
        field('thickness', 'Espessura', 'cm', 5),
        field('count', 'Quantidade', 'un', 40),
        field('waste', 'Perdas', '%', 10),
        field('unitCost', 'Custo da madeira', 'R$/m³', 3800)
      ],
      calculate: (v) => {
        const each = v.length * v.width / 100 * v.thickness / 100;
        const total = each * v.count;
        const adjusted = total * (1 + v.waste / 100);
        return result('Volume de madeira com perdas', `${format(adjusted, 3)} m³`, [
          ['Volume por peça', `${format(each, 4)} m³`],
          ['Comprimento total', `${format(v.length * v.count)} m`],
          ['Peças com margem', `${ceil(v.count * (1 + v.waste / 100))} un`],
          ['Custo estimado', money(adjusted * v.unitCost)]
        ]);
      }
    },
    rebar: {
      fields: () => [
        field('length', 'Comprimento por barra', 'm', 12),
        field('count', 'Quantidade de barras', 'un', 50),
        field('diameter', 'Diâmetro', 'mm', 10),
        field('waste', 'Perdas', '%', 8),
        field('unitCost', 'Custo do aço', 'R$/kg', 7.8)
      ],
      calculate: (v) => {
        const totalLength = v.length * v.count * (1 + v.waste / 100);
        const kgPerM = v.diameter ** 2 / 162;
        const weight = totalLength * kgPerM;
        return result('Peso de aço com perdas', `${format(weight, 1)} kg`, [
          ['Comprimento total', `${format(totalLength)} m`],
          ['Peso linear', `${format(kgPerM, 3)} kg/m`],
          ['Barras equivalentes', `${ceil(v.count * (1 + v.waste / 100))} un`],
          ['Custo estimado', money(weight * v.unitCost)]
        ]);
      }
    },
    mesh: {
      fields: () => [
        field('length', 'Comprimento da malha', 'm', 10),
        field('width', 'Largura da malha', 'm', 8),
        field('spacingX', 'Espaçamento longitudinal', 'cm', 20),
        field('spacingY', 'Espaçamento transversal', 'cm', 20),
        field('diameter', 'Diâmetro da barra', 'mm', 6.3),
        field('waste', 'Perdas', '%', 10),
        field('unitCost', 'Custo do aço', 'R$/kg', 7.8)
      ],
      calculate: (v) => {
        const barsX = ceil(v.width / Math.max(v.spacingX / 100, .01)) + 1;
        const barsY = ceil(v.length / Math.max(v.spacingY / 100, .01)) + 1;
        const length = (barsX * v.length + barsY * v.width) * (1 + v.waste / 100);
        const weight = length * v.diameter ** 2 / 162;
        return result('Peso estimado da malha', `${format(weight, 1)} kg`, [
          ['Barras longitudinais', `${barsX} un`],
          ['Barras transversais', `${barsY} un`],
          ['Comprimento total', `${format(length)} m`],
          ['Custo estimado', money(weight * v.unitCost)]
        ]);
      }
    },
    tile: {
      fields: (calc) => [
        field('length', 'Comprimento da superfície', 'm', 5),
        field('height', 'Altura / largura', 'm', 3),
        field('pieceW', 'Largura da peça', 'cm', calc.config.defaultPieceW || 60),
        field('pieceH', 'Altura da peça', 'cm', calc.config.defaultPieceH || 60),
        field('waste', 'Perdas e recortes', '%', 10),
        field('unitCost', 'Custo por peça', 'R$/un', 8.5),
        field('mortarRate', 'Argamassa', 'kg/m²', 5)
      ],
      calculate: (v) => {
        const area = v.length * v.height;
        const adjusted = area * (1 + v.waste / 100);
        const pieceArea = Math.max(v.pieceW * v.pieceH / 10000, .0001);
        const pieces = ceil(adjusted / pieceArea);
        return result('Quantidade de peças', `${pieces} un`, [
          ['Área geométrica', `${format(area)} m²`],
          ['Área com perdas', `${format(adjusted)} m²`],
          ['Área por peça', `${format(pieceArea, 3)} m²`],
          ['Argamassa estimada', `${format(adjusted * v.mortarRate, 0)} kg`],
          ['Custo das peças', money(pieces * v.unitCost)]
        ]);
      }
    },
    drywall: {
      fields: () => [
        field('length', 'Comprimento da parede', 'm', 8),
        field('height', 'Altura da parede', 'm', 2.8),
        field('sides', 'Número de faces', 'faces', 2),
        field('boardW', 'Largura da chapa', 'm', 1.2),
        field('boardH', 'Altura da chapa', 'm', 2.4),
        field('studSpacing', 'Espaçamento de montantes', 'm', 0.6),
        field('waste', 'Perdas', '%', 10),
        field('boardCost', 'Custo por chapa', 'R$/un', 68)
      ],
      calculate: (v) => {
        const area = v.length * v.height * v.sides;
        const adjusted = area * (1 + v.waste / 100);
        const boards = ceil(adjusted / Math.max(v.boardW * v.boardH, .01));
        const studs = ceil(v.length / Math.max(v.studSpacing, .1)) + 1;
        const screws = ceil(adjusted * 20);
        return result('Quantidade de chapas', `${boards} un`, [
          ['Área total de faces', `${format(area)} m²`],
          ['Área com perdas', `${format(adjusted)} m²`],
          ['Montantes', `${studs} un`],
          ['Parafusos estimados', `${screws} un`],
          ['Custo das chapas', money(boards * v.boardCost)]
        ]);
      }
    },
    paint: {
      fields: () => [
        field('area', 'Área a pintar', 'm²', 120),
        field('coats', 'Número de demãos', 'demãos', 2),
        field('coverage', 'Rendimento por demão', 'm²/L', 10),
        field('waste', 'Perdas', '%', 10),
        field('canSize', 'Tamanho da embalagem', 'L', 18),
        field('canCost', 'Custo por embalagem', 'R$/un', 420)
      ],
      calculate: (v) => {
        const liters = v.area * v.coats / Math.max(v.coverage, .1) * (1 + v.waste / 100);
        const cans = ceil(liters / Math.max(v.canSize, .1));
        return result('Tinta necessária', `${format(liters, 1)} L`, [
          ['Área-demão', `${format(v.area * v.coats)} m²`],
          ['Embalagens', `${cans} un de ${format(v.canSize, 1)} L`],
          ['Volume comprado', `${format(cans * v.canSize, 1)} L`],
          ['Custo estimado', money(cans * v.canCost)]
        ]);
      }
    },
    wallpaper: {
      fields: () => [
        field('perimeter', 'Perímetro das paredes', 'm', 18),
        field('height', 'Altura', 'm', 2.8),
        field('rollW', 'Largura do rolo', 'm', 0.53),
        field('rollL', 'Comprimento do rolo', 'm', 10),
        field('repeat', 'Repetição do desenho', 'cm', 0),
        field('waste', 'Perdas', '%', 8),
        field('rollCost', 'Custo por rolo', 'R$/un', 95)
      ],
      calculate: (v) => {
        const stripHeight = v.height + v.repeat / 100;
        const strips = ceil(v.perimeter / Math.max(v.rollW, .01));
        const stripsPerRoll = Math.max(1, Math.floor(v.rollL / Math.max(stripHeight, .01)));
        const rolls = ceil((strips / stripsPerRoll) * (1 + v.waste / 100));
        return result('Quantidade de rolos', `${rolls} un`, [
          ['Faixas necessárias', `${strips} un`],
          ['Faixas por rolo', `${stripsPerRoll} un`],
          ['Área de parede', `${format(v.perimeter * v.height)} m²`],
          ['Custo estimado', money(rolls * v.rollCost)]
        ]);
      }
    },
    fasteners: {
      fields: (calc) => [
        field('area', calc.config.vents ? 'Área da fundação' : 'Área a fixar', 'm²', calc.config.vents ? 120 : 80),
        field('spacing', calc.config.vents ? 'Área atendida por abertura' : 'Espaçamento entre fixadores', calc.config.vents ? 'm²/un' : 'cm', calc.config.vents ? 20 : 30),
        field('rows', calc.config.vents ? 'Fator mínimo de segurança' : 'Número de linhas', calc.config.vents ? '%' : 'linhas', calc.config.vents ? 20 : 4),
        field('waste', 'Margem adicional', '%', 10),
        field('unitCost', 'Custo unitário', 'R$/un', calc.config.vents ? 75 : 0.35)
      ],
      calculate: (v, calc) => {
        let count;
        if (calc.config.vents) count = ceil(v.area / Math.max(v.spacing, .1) * (1 + (v.rows + v.waste) / 100));
        else count = ceil((Math.sqrt(v.area) / Math.max(v.spacing / 100, .01) + 1) ** 2 * Math.max(v.rows, 1) * (1 + v.waste / 100));
        return result(calc.config.vents ? 'Quantidade de respiros' : 'Quantidade de fixadores', `${count} un`, [
          ['Área considerada', `${format(v.area)} m²`],
          ['Margem aplicada', `${format(v.waste, 0)}%`],
          ['Custo estimado', money(count * v.unitCost)]
        ]);
      }
    },
    floor: {
      fields: (calc) => [
        field('length', 'Comprimento da área', 'm', 8),
        field('width', 'Largura da área', 'm', 6),
        field('coverage', `Cobertura por ${calc.config.productLabel || 'unidade'}`, 'm²/un', calc.config.defaultCoverage || 1.44),
        field('waste', 'Perdas e recortes', '%', 10),
        field('unitCost', 'Custo por unidade', 'R$/un', 85)
      ],
      calculate: (v, calc) => {
        const area = v.length * v.width;
        const adjusted = area * (1 + v.waste / 100);
        const units = ceil(adjusted / Math.max(v.coverage, .001));
        return result(`Quantidade de ${calc.config.productLabel || 'unidades'}`, `${units} un`, [
          ['Área geométrica', `${format(area)} m²`],
          ['Área com perdas', `${format(adjusted)} m²`],
          ['Cobertura comprada', `${format(units * v.coverage)} m²`],
          ['Custo estimado', money(units * v.unitCost)]
        ]);
      }
    },
    wall: {
      fields: (calc) => [
        field('length', 'Comprimento total', 'm', 12),
        field('height', 'Altura', 'm', 2.8),
        field('openings', 'Área de portas e janelas', 'm²', 4),
        field('unitW', calc.config.log ? 'Diâmetro da tora' : 'Comprimento da peça', 'cm', calc.config.log ? 20 : (calc.config.brick ? 19 : 39)),
        field('unitH', calc.config.log ? 'Altura útil da tora' : 'Altura da peça', 'cm', calc.config.log ? 18 : (calc.config.brick ? 9 : 19)),
        field('waste', 'Perdas', '%', 10),
        field('unitCost', 'Custo por peça', 'R$/un', calc.config.log ? 85 : 3.8)
      ],
      calculate: (v, calc) => {
        const area = Math.max(0, v.length * v.height - v.openings);
        const pieceArea = Math.max(v.unitW * v.unitH / 10000, .0001);
        const units = ceil(area / pieceArea * (1 + v.waste / 100));
        const mortar = calc.config.log ? 0 : area * 0.018;
        return result(calc.config.log ? 'Quantidade de toras' : 'Quantidade de peças', `${units} un`, [
          ['Área líquida', `${format(area)} m²`],
          ['Área por peça', `${format(pieceArea, 3)} m²`],
          ['Argamassa estimada', `${format(mortar, 2)} m³`],
          ['Custo estimado', money(units * v.unitCost)]
        ]);
      }
    },
    fence: {
      fields: () => [
        field('length', 'Comprimento da cerca', 'm', 60),
        field('height', 'Altura', 'm', 2),
        field('postSpacing', 'Espaçamento entre postes', 'm', 2.5),
        field('panelWidth', 'Largura do painel', 'm', 2.5),
        field('waste', 'Margem adicional', '%', 5),
        field('panelCost', 'Custo por painel', 'R$/un', 320),
        field('postCost', 'Custo por poste', 'R$/un', 140)
      ],
      calculate: (v) => {
        const panels = ceil(v.length / Math.max(v.panelWidth, .1) * (1 + v.waste / 100));
        const posts = ceil(v.length / Math.max(v.postSpacing, .1)) + 1;
        return result('Quantidade de painéis', `${panels} un`, [
          ['Postes', `${posts} un`],
          ['Área de fechamento', `${format(v.length * v.height)} m²`],
          ['Custo dos painéis', money(panels * v.panelCost)],
          ['Custo dos postes', money(posts * v.postCost)],
          ['Custo total estimado', money(panels * v.panelCost + posts * v.postCost)]
        ]);
      }
    },
    decking: {
      fields: (calc) => [
        field('length', calc.config.wallMode ? 'Comprimento da parede' : 'Comprimento da área', 'm', 8),
        field('width', calc.config.wallMode ? 'Altura da parede' : 'Largura da área', 'm', 5),
        field('boardW', 'Largura da tábua', 'cm', 10),
        field('gap', 'Espaçamento entre tábuas', 'mm', 5),
        field('boardLength', 'Comprimento comercial', 'm', 3),
        field('waste', 'Perdas', '%', 10),
        field('unitCost', 'Custo por tábua', 'R$/un', 48)
      ],
      calculate: (v) => {
        const area = v.length * v.width;
        const module = v.boardW / 100 + v.gap / 1000;
        const rows = ceil(v.width / Math.max(module, .001));
        const linear = rows * v.length * (1 + v.waste / 100);
        const boards = ceil(linear / Math.max(v.boardLength, .1));
        return result('Quantidade de tábuas', `${boards} un`, [
          ['Área', `${format(area)} m²`],
          ['Fileiras', `${rows} un`],
          ['Comprimento linear', `${format(linear)} m`],
          ['Custo estimado', money(boards * v.unitCost)]
        ]);
      }
    },
    area: {
      fields: () => [
        field('base1', 'Base / largura inicial', 'm', 20),
        field('base2', 'Base / largura final', 'm', 24),
        field('length', 'Comprimento médio', 'm', 35),
        field('waste', 'Margem de levantamento', '%', 0),
        field('unitCost', 'Custo por m²', 'R$/m²', 0)
      ],
      calculate: (v) => {
        const area = ((v.base1 + v.base2) / 2) * v.length;
        const adjusted = area * (1 + v.waste / 100);
        return result('Área aproximada', `${format(adjusted)} m²`, [
          ['Área sem margem', `${format(area)} m²`],
          ['Equivalente em hectares', `${format(adjusted / 10000, 4)} ha`],
          ['Custo estimado', money(adjusted * v.unitCost)]
        ], 'Para terrenos complexos, utilize levantamento topográfico e coordenadas georreferenciadas.');
      }
    },
    trench: {
      fields: (calc) => [
        field('length', calc.config.pit ? 'Comprimento da escavação' : 'Comprimento da vala', 'm', calc.config.pit ? 12 : 40),
        field('bottomW', 'Largura no fundo', 'm', calc.config.pit ? 8 : 0.8),
        field('topW', 'Largura no topo', 'm', calc.config.pit ? 14 : 1.2),
        field('depth', 'Profundidade média', 'm', calc.config.pit ? 2.5 : 1.5),
        field('bulking', 'Empolamento do solo', '%', 25),
        field('truckCapacity', 'Capacidade do caminhão', 'm³', 12),
        field('unitCost', 'Custo de escavação', 'R$/m³', 38)
      ],
      calculate: (v) => {
        const section = (v.bottomW + v.topW) / 2 * v.depth;
        const volume = section * v.length;
        const loose = volume * (1 + v.bulking / 100);
        return result('Volume de corte', `${format(volume)} m³`, [
          ['Seção média', `${format(section)} m²`],
          ['Volume solto', `${format(loose)} m³`],
          ['Viagens de caminhão', `${ceil(loose / Math.max(v.truckCapacity, .1))} un`],
          ['Custo estimado', money(volume * v.unitCost)]
        ], 'Taludes, escoramentos, interferências e classificação do solo devem ser avaliados antes da escavação.');
      }
    },
    well: {
      fields: () => [
        field('diameter', 'Diâmetro interno', 'm', 1.2),
        field('depth', 'Profundidade', 'm', 8),
        field('wall', 'Espessura do revestimento', 'cm', 10),
        field('waterDepth', 'Altura de água', 'm', 5),
        field('unitCost', 'Custo por m³ escavado', 'R$/m³', 120)
      ],
      calculate: (v) => {
        const r = v.diameter / 2;
        const excavation = Math.PI * (r + v.wall / 100) ** 2 * v.depth;
        const capacity = Math.PI * r ** 2 * Math.min(v.waterDepth, v.depth);
        const lining = excavation - Math.PI * r ** 2 * v.depth;
        return result('Volume de escavação', `${format(excavation)} m³`, [
          ['Capacidade de água', `${format(capacity)} m³`],
          ['Capacidade em litros', `${format(capacity * 1000, 0)} L`],
          ['Revestimento aproximado', `${format(lining)} m³`],
          ['Custo de escavação', money(excavation * v.unitCost)]
        ]);
      }
    },
    pool: {
      fields: () => [
        field('length', 'Comprimento interno', 'm', 8),
        field('width', 'Largura interna', 'm', 4),
        field('depthMin', 'Profundidade mínima', 'm', 1.2),
        field('depthMax', 'Profundidade máxima', 'm', 1.8),
        field('waterCost', 'Custo da água', 'R$/m³', 8),
        field('tileCost', 'Custo de revestimento', 'R$/m²', 95)
      ],
      calculate: (v) => {
        const depth = (v.depthMin + v.depthMax) / 2;
        const volume = v.length * v.width * depth;
        const lining = v.length * v.width + 2 * depth * (v.length + v.width);
        return result('Capacidade de água', `${format(volume)} m³`, [
          ['Volume em litros', `${format(volume * 1000, 0)} L`],
          ['Área de revestimento', `${format(lining)} m²`],
          ['Custo de enchimento', money(volume * v.waterCost)],
          ['Custo do revestimento', money(lining * v.tileCost)]
        ]);
      }
    },
    pipe: {
      fields: () => [
        field('length', 'Comprimento da tubulação', 'm', 100),
        field('diameter', 'Diâmetro interno', 'mm', 100),
        field('fill', 'Percentual preenchido', '%', 100),
        field('density', 'Densidade do fluido', 'kg/m³', 1000)
      ],
      calculate: (v) => {
        const r = v.diameter / 2000;
        const full = Math.PI * r ** 2 * v.length;
        const volume = full * clamp(v.fill, 0, 100) / 100;
        return result('Volume de fluido', `${format(volume, 3)} m³`, [
          ['Capacidade total', `${format(full * 1000, 1)} L`],
          ['Volume atual', `${format(volume * 1000, 1)} L`],
          ['Volume por metro', `${format(Math.PI * r ** 2 * 1000, 2)} L/m`],
          ['Massa do fluido', `${format(volume * v.density, 1)} kg`]
        ]);
      }
    },
    tankCylinder: {
      fields: (calc) => [
        field('diameter', 'Diâmetro interno', 'm', 2.4),
        field('length', calc.config.horizontal ? 'Comprimento do tanque' : 'Altura útil / comprimento', 'm', 6),
        selectField('fillMode', 'Forma de cálculo', calc.config.levelMode ? 'level' : 'percent', [
          { value: 'level', label: 'Pelo nível do líquido em metros' },
          { value: 'percent', label: 'Pelo percentual de enchimento' }
        ], 'Escolha se deseja calcular pela régua/nível em metros ou por percentual.'),
        field('liquidLevel', calc.config.horizontal ? 'Nível do líquido' : 'Altura do líquido', 'm', calc.config.horizontal ? 1.2 : 4.5, 'Para tanque horizontal, informe o nível medido do fundo até a lâmina.'),
        field('fill', 'Percentual de enchimento', '%', 75),
        field('density', 'Densidade do líquido', 'kg/m³', 1000)
      ],
      calculate: (v, calc) => {
        const d = Math.max(v.diameter, .0001);
        const r = d / 2;
        const length = Math.max(v.length, .0001);
        const capacity = Math.PI * r ** 2 * length;
        let volume = 0;
        let level = 0;
        let percent = clamp(v.fill, 0, 100);
        if (v.fillMode === 'level') {
          if (calc.config.horizontal) {
            level = clamp(v.liquidLevel, 0, d);
            const segmentArea = level <= 0 ? 0 : level >= d ? Math.PI * r ** 2 : r ** 2 * Math.acos((r - level) / r) - (r - level) * Math.sqrt(Math.max(2 * r * level - level ** 2, 0));
            volume = segmentArea * length;
            percent = capacity ? volume / capacity * 100 : 0;
          } else {
            level = clamp(v.liquidLevel, 0, length);
            volume = Math.PI * r ** 2 * level;
            percent = capacity ? volume / capacity * 100 : 0;
          }
        } else {
          volume = capacity * percent / 100;
          if (calc.config.horizontal) {
            level = d * percent / 100;
          } else {
            level = length * percent / 100;
          }
        }
        const label = calc.config.horizontal ? 'Volume pelo nível do tanque horizontal' : 'Volume pelo nível do tanque vertical';
        return result(label, `${format(volume)} m³`, [
          ['Capacidade total', `${format(capacity)} m³`],
          ['Capacidade total', `${format(capacity * 1000, 0)} L`],
          ['Nível considerado', `${format(level)} m`],
          ['Percentual ocupado', `${format(percent, 1)}%`],
          ['Volume ocupado', `${format(volume * 1000, 0)} L`],
          ['Massa do líquido', `${format(volume * v.density, 0)} kg`]
        ], calc.config.horizontal ? 'Tanque horizontal calculado por segmento circular quando usado nível em metros. Confirme dimensões internas, fundos, inclinação e geometria real do equipamento.' : 'Tanque vertical calculado pela altura real de líquido. Confirme dimensões internas e área útil do tanque.');
      }
    },
    tankRect: {
      fields: () => [
        field('length', 'Comprimento interno', 'm', 4),
        field('width', 'Largura interna', 'm', 2.5),
        field('height', 'Altura interna', 'm', 2),
        field('fillHeight', 'Altura do líquido', 'm', 1.6),
        field('density', 'Densidade do líquido', 'kg/m³', 1000)
      ],
      calculate: (v) => {
        const capacity = v.length * v.width * v.height;
        const volume = v.length * v.width * Math.min(v.fillHeight, v.height);
        return result('Volume atual', `${format(volume)} m³`, [
          ['Capacidade total', `${format(capacity)} m³`],
          ['Percentual ocupado', `${format(volume / Math.max(capacity, .001) * 100, 1)}%`],
          ['Volume em litros', `${format(volume * 1000, 0)} L`],
          ['Massa do líquido', `${format(volume * v.density, 0)} kg`]
        ]);
      }
    },
    truncated: {
      fields: () => [
        field('baseA', 'Lado da base maior', 'm', 3),
        field('baseB', 'Lado da base menor', 'm', 1.5),
        field('height', 'Altura', 'm', 2),
        field('unitCost', 'Custo por m² de chapa', 'R$/m²', 120)
      ],
      calculate: (v) => {
        const slant = Math.hypot(v.height, (v.baseA - v.baseB) / 2);
        const lateral = 2 * (v.baseA + v.baseB) * slant;
        const volume = v.height / 3 * (v.baseA ** 2 + v.baseA * v.baseB + v.baseB ** 2);
        return result('Área lateral', `${format(lateral)} m²`, [
          ['Geratriz', `${format(slant)} m`],
          ['Volume', `${format(volume)} m³`],
          ['Custo de chapa', money(lateral * v.unitCost)]
        ]);
      }
    },
    truncatedCone: {
      fields: () => [
        field('diameterA', 'Diâmetro maior', 'm', 2.4),
        field('diameterB', 'Diâmetro menor', 'm', 1.2),
        field('height', 'Altura', 'm', 2),
        field('unitCost', 'Custo por m² de chapa', 'R$/m²', 120)
      ],
      calculate: (v) => {
        const R = v.diameterA / 2, r = v.diameterB / 2;
        const slant = Math.hypot(v.height, R - r);
        const lateral = Math.PI * (R + r) * slant;
        const volume = Math.PI * v.height / 3 * (R ** 2 + R * r + r ** 2);
        return result('Área lateral', `${format(lateral)} m²`, [
          ['Geratriz', `${format(slant)} m`],
          ['Volume', `${format(volume)} m³`],
          ['Custo de chapa', money(lateral * v.unitCost)]
        ]);
      }
    },
    gravel: {
      fields: () => [
        field('diameter', 'Diâmetro da base', 'm', 8),
        field('height', 'Altura da pilha', 'm', 2.5),
        field('density', 'Densidade aparente', 'kg/m³', 1600),
        field('unitCost', 'Custo por tonelada', 'R$/t', 95)
      ],
      calculate: (v) => {
        const volume = Math.PI * (v.diameter / 2) ** 2 * v.height / 3;
        const mass = volume * v.density;
        return result('Volume da pilha', `${format(volume)} m³`, [
          ['Massa aproximada', `${format(mass / 1000)} t`],
          ['Área da base', `${format(Math.PI * (v.diameter / 2) ** 2)} m²`],
          ['Custo estimado', money(mass / 1000 * v.unitCost)]
        ]);
      }
    },
    ventilation: {
      fields: () => [
        field('length', 'Comprimento do ambiente', 'm', 8),
        field('width', 'Largura do ambiente', 'm', 6),
        field('height', 'Pé-direito', 'm', 3),
        field('changes', 'Renovações de ar', 'trocas/h', 6),
        field('reserve', 'Reserva de projeto', '%', 15)
      ],
      calculate: (v) => {
        const volume = v.length * v.width * v.height;
        const flow = volume * v.changes * (1 + v.reserve / 100);
        return result('Vazão de ar necessária', `${format(flow, 0)} m³/h`, [
          ['Volume do ambiente', `${format(volume)} m³`],
          ['Vazão por minuto', `${format(flow / 60)} m³/min`],
          ['Vazão em L/s', `${format(flow / 3.6)} L/s`]
        ], 'Taxas de renovação variam conforme ocupação, processo, calor, contaminantes e normas técnicas aplicáveis.');
      }
    },
    waterMix: {
      fields: () => [
        field('hotVolume', 'Volume de água quente', 'L', 100),
        field('hotTemp', 'Temperatura quente', '°C', 80),
        field('coldVolume', 'Volume de água fria', 'L', 200),
        field('coldTemp', 'Temperatura fria', '°C', 20)
      ],
      calculate: (v) => {
        const total = v.hotVolume + v.coldVolume;
        const temp = total ? (v.hotVolume * v.hotTemp + v.coldVolume * v.coldTemp) / total : 0;
        return result('Temperatura final', `${format(temp, 1)} °C`, [
          ['Volume total', `${format(total, 1)} L`],
          ['Energia relativa quente', `${format(v.hotVolume * v.hotTemp, 0)} L·°C`],
          ['Energia relativa fria', `${format(v.coldVolume * v.coldTemp, 0)} L·°C`]
        ], 'Cálculo ideal sem perdas térmicas, mudança de fase ou diferença relevante de propriedades físicas.');
      }
    },
    machineHourlyCost: {
      fields: () => [
        field('fuelConsumption', 'Consumo de combustível', 'L/h', 18),
        field('fuelPrice', 'Preço do diesel', 'R$/L', 6.20),
        field('operatorCost', 'Operador + encargos', 'R$/h', 38),
        field('maintenance', 'Manutenção e pneus', 'R$/h', 55),
        field('depreciation', 'Depreciação / propriedade', 'R$/h', 72),
        field('other', 'Outros custos', 'R$/h', 15),
        field('utilization', 'Utilização produtiva', '%', 85)
      ],
      calculate: (v) => {
        const fuel = v.fuelConsumption * v.fuelPrice;
        const gross = fuel + v.operatorCost + v.maintenance + v.depreciation + v.other;
        const productive = gross / Math.max(v.utilization / 100, .01);
        return result('Custo horário produtivo', money(productive), [
          ['Combustível', money(fuel)],
          ['Custo horário direto', money(gross)],
          ['Utilização produtiva', `${format(v.utilization, 1)}%`],
          ['Custo por turno 8h', money(productive * 8)],
          ['Custo mensal 220h', money(productive * 220)]
        ], 'Custo horário deve ser ajustado conforme telemetria, combustível real, manutenção, operador, pneus, depreciação, seguro e regime de operação.');
      }
    },
    machineProduction: {
      fields: () => [
        field('bucket', 'Capacidade da caçamba', 'm³', 1.2),
        field('cycle', 'Tempo de ciclo', 's', 35),
        field('fillFactor', 'Fator de enchimento', '%', 90),
        field('efficiency', 'Eficiência operacional', '%', 80),
        field('swell', 'Fator de empolamento', '%', 20),
        field('hourCost', 'Custo horário da máquina', 'R$/h', 420)
      ],
      calculate: (v) => {
        const loose = v.bucket * (3600 / Math.max(v.cycle, 1)) * (v.fillFactor/100) * (v.efficiency/100);
        const bank = loose / (1 + v.swell / 100);
        return result('Produção efetiva', `${format(bank)} m³/h`, [
          ['Produção solta', `${format(loose)} m³/h`],
          ['Produção no corte', `${format(bank)} m³/h`],
          ['Custo por m³', money(v.hourCost / Math.max(bank, .001))],
          ['Produção por turno 8h', `${format(bank * 8)} m³`]
        ], 'Produtividade depende do operador, frente de serviço, material, giro, espera, altura de banco e condições de acesso.');
      }
    },
    truckHaulage: {
      fields: () => [
        field('volume', 'Volume a transportar', 'm³', 500),
        field('truckCapacity', 'Capacidade do caminhão', 'm³', 14),
        field('distance', 'Distância ida', 'km', 8),
        field('speedLoaded', 'Velocidade carregado', 'km/h', 28),
        field('speedEmpty', 'Velocidade vazio', 'km/h', 35),
        field('loadTime', 'Tempo carga', 'min', 8),
        field('dumpTime', 'Tempo descarga/manobra', 'min', 5),
        field('fleet', 'Quantidade de caminhões', 'un', 4),
        field('truckCost', 'Custo por caminhão', 'R$/h', 260)
      ],
      calculate: (v) => {
        const cycle = (v.distance/Math.max(v.speedLoaded,1) + v.distance/Math.max(v.speedEmpty,1))*60 + v.loadTime + v.dumpTime;
        const tripsPerTruck = 60 / Math.max(cycle, 1);
        const production = tripsPerTruck * v.truckCapacity * v.fleet;
        const trips = ceil(v.volume / Math.max(v.truckCapacity, .001));
        const hours = v.volume / Math.max(production, .001);
        return result('Produção da frota', `${format(production)} m³/h`, [
          ['Tempo de ciclo', `${format(cycle,1)} min`],
          ['Viagens necessárias', `${trips} viagens`],
          ['Duração estimada', `${format(hours)} h`],
          ['Custo por m³', money((v.fleet*v.truckCost)/Math.max(production,.001))],
          ['Custo total', money(hours*v.fleet*v.truckCost)]
        ], 'Transporte deve considerar fila, pista, rampa, umidade, balança, restrições de tráfego e capacidade legal.');
      }
    },
    fleetBalance: {
      fields: () => [
        field('loaderProduction', 'Produção da escavadeira/carregadeira', 'm³/h', 120),
        field('truckCapacity', 'Capacidade do caminhão', 'm³', 14),
        field('cycle', 'Ciclo total do caminhão', 'min', 28),
        field('targetUtilization', 'Utilização desejada da máquina', '%', 85)
      ],
      calculate: (v) => {
        const truckProd = v.truckCapacity * 60 / Math.max(v.cycle, 1);
        const needed = ceil(v.loaderProduction * v.targetUtilization / 100 / Math.max(truckProd, .001));
        const fleetProd = needed * truckProd;
        return result('Caminhões recomendados', `${needed} un`, [
          ['Produção por caminhão', `${format(truckProd)} m³/h`],
          ['Produção da frota', `${format(fleetProd)} m³/h`],
          ['Ociosidade provável', `${format(Math.max(0, 1 - v.loaderProduction/Math.max(fleetProd,.001))*100,1)}%`]
        ], 'O balanceamento real deve considerar filas, tempo de carga, restrições de descarga, distância e variação da produção.');
      }
    },
    compactionProduction: {
      fields: () => [
        field('width', 'Largura compactada', 'm', 2.1),
        field('speed', 'Velocidade de operação', 'km/h', 4),
        field('passes', 'Número de passadas', 'un', 6),
        field('efficiency', 'Eficiência', '%', 75),
        field('thickness', 'Espessura da camada', 'cm', 20),
        field('hourCost', 'Custo horário', 'R$/h', 310)
      ],
      calculate: (v) => {
        const area = v.width * (v.speed*1000) / Math.max(v.passes,1) * (v.efficiency/100);
        const volume = area * v.thickness/100;
        return result('Área compactada', `${format(area)} m²/h`, [
          ['Volume compactado', `${format(volume)} m³/h`],
          ['Custo por m²', money(v.hourCost/Math.max(area,.001))],
          ['Custo por m³', money(v.hourCost/Math.max(volume,.001))]
        ], 'A produção depende do grau de compactação, umidade, espessura, material e especificação do projeto.');
      }
    },
    fuelCost: {
      fields: () => [
        field('consumption', 'Consumo médio', 'L/h', 18),
        field('fuelPrice', 'Preço do combustível', 'R$/L', 6.20),
        field('hoursDay', 'Horas por dia', 'h/dia', 8),
        field('days', 'Dias trabalhados', 'dias', 22),
        field('productionHour', 'Produção horária', 'un/h', 80)
      ],
      calculate: (v) => {
        const hour = v.consumption*v.fuelPrice;
        const day = hour*v.hoursDay;
        const month = day*v.days;
        const unit = hour/Math.max(v.productionHour,.001);
        return result('Custo de combustível por hora', money(hour), [
          ['Custo por dia', money(day)],
          ['Custo mensal', money(month)],
          ['Consumo mensal', `${format(v.consumption*v.hoursDay*v.days,0)} L`],
          ['Custo por unidade produzida', money(unit)]
        ], 'Use consumo medido por telemetria ou abastecimento para orçamento mais confiável.');
      }
    },
    equipmentDepreciation: {
      fields: () => [
        field('purchaseValue', 'Valor de aquisição', 'R$', 850000),
        field('residualValue', 'Valor residual', 'R$', 180000),
        field('lifeHours', 'Vida econômica', 'h', 10000),
        field('insuranceTax', 'Seguro/juros anual', '%', 8),
        field('hoursYear', 'Horas por ano', 'h/ano', 1800)
      ],
      calculate: (v) => {
        const depreciation = (v.purchaseValue - v.residualValue)/Math.max(v.lifeHours,1);
        const ownership = ((v.purchaseValue + v.residualValue)/2) * (v.insuranceTax/100) / Math.max(v.hoursYear,1);
        return result('Custo de propriedade', money(depreciation+ownership), [
          ['Depreciação horária', money(depreciation)],
          ['Seguro/juros por hora', money(ownership)],
          ['Custo mensal 220h', money((depreciation+ownership)*220)]
        ], 'A depreciação deve considerar vida econômica real, valor de revenda, financiamento, disponibilidade e política contábil.');
      }
    },
    concretePump: {
      fields: () => [
        field('volume', 'Volume de concreto', 'm³', 80),
        field('production', 'Produção efetiva', 'm³/h', 35),
        field('setup', 'Montagem / espera', 'h', 1.5),
        field('hourCost', 'Custo horário', 'R$/h', 680),
        field('mobilization', 'Mobilização', 'R$', 1200)
      ],
      calculate: (v) => {
        const hours = v.volume/Math.max(v.production,.001)+v.setup;
        const cost = hours*v.hourCost+v.mobilization;
        return result('Tempo de bombeamento', `${format(hours)} h`, [
          ['Custo total', money(cost)],
          ['Custo por m³', money(cost/Math.max(v.volume,.001))],
          ['Volume por hora efetiva', `${format(v.production)} m³/h`]
        ], 'Considere distância de bombeamento, lançamento, slump, diâmetro de mangote, espera e limpeza.');
      }
    },
    plantProduction: {
      fields: () => [
        field('nominal', 'Produção nominal', 't/h', 180),
        field('efficiency', 'Eficiência operacional', '%', 72),
        field('energy', 'Energia', 'kWh/t', 3.5),
        field('energyCost', 'Custo energia', 'R$/kWh', 0.95),
        field('fixedCost', 'Custo fixo operacional', 'R$/h', 950)
      ],
      calculate: (v) => {
        const prod = v.nominal*v.efficiency/100;
        const energyCost = v.energy*v.energyCost;
        const unit = v.fixedCost/Math.max(prod,.001)+energyCost;
        return result('Produção efetiva', `${format(prod)} t/h`, [
          ['Custo energia por t', money(energyCost)],
          ['Custo fixo por t', money(v.fixedCost/Math.max(prod,.001))],
          ['Custo total por t', money(unit)],
          ['Produção por turno 8h', `${format(prod*8)} t`]
        ], 'A produção real depende de granulometria, umidade, alimentação, paradas e disponibilidade mecânica.');
      }
    },
    laborCrewCost: {
      fields: () => [
        field('workers', 'Ajudantes / oficiais', 'un', 6),
        field('hourCost', 'Custo médio com encargos', 'R$/h', 32),
        field('hoursDay', 'Horas por dia', 'h', 8),
        field('days', 'Dias no mês', 'dias', 22),
        field('overtime', 'Horas extras no mês', 'h', 20),
        field('overtimeFactor', 'Fator hora extra', 'x', 1.5)
      ],
      calculate: (v) => {
        const normal = v.workers*v.hourCost*v.hoursDay*v.days;
        const extra = v.workers*v.hourCost*v.overtime*v.overtimeFactor;
        return result('Custo mensal da equipe', money(normal+extra), [
          ['Custo diário', money(v.workers*v.hourCost*v.hoursDay)],
          ['Custo normal mensal', money(normal)],
          ['Horas extras', money(extra)],
          ['Custo por hora da equipe', money(v.workers*v.hourCost)]
        ], 'Inclua encargos, benefícios, transporte, alimentação, alojamento, EPI e improdutividades.');
      }
    },
    crewProductivity: {
      fields: () => [
        field('quantity', 'Quantidade do serviço', 'un', 1000),
        field('productivity', 'Produtividade da equipe', 'un/dia', 85),
        field('crewDailyCost', 'Custo diário da equipe', 'R$/dia', 1850),
        field('teams', 'Número de equipes', 'un', 1)
      ],
      calculate: (v) => {
        const days = v.quantity/Math.max(v.productivity*v.teams,.001);
        const cost = days*v.crewDailyCost*v.teams;
        return result('Duração estimada', `${format(days)} dias`, [
          ['Custo total', money(cost)],
          ['Custo unitário', money(cost/Math.max(v.quantity,.001))],
          ['Produção diária total', `${format(v.productivity*v.teams)} un/dia`]
        ], 'Produtividade depende de frente liberada, abastecimento, clima, qualidade da equipe e logística da obra.');
      }
    },
    bdi: {
      fields: () => [
        field('directCost', 'Custo direto', 'R$', 100000),
        field('admin', 'Administração central', '%', 5),
        field('taxes', 'Impostos', '%', 8.65),
        field('risk', 'Risco / seguros', '%', 2),
        field('financial', 'Despesas financeiras', '%', 1.5),
        field('profit', 'Lucro', '%', 10)
      ],
      calculate: (v) => {
        const bdi = ((1+v.admin/100)*(1+v.risk/100)*(1+v.financial/100)*(1+v.profit/100)/(1-v.taxes/100)-1)*100;
        const price = v.directCost*(1+bdi/100);
        return result('Preço de venda', money(price), [
          ['BDI calculado', `${format(bdi,2)}%`],
          ['Custo direto', money(v.directCost)],
          ['Valor do BDI', money(price-v.directCost)],
          ['Markup', `${format(price/Math.max(v.directCost,.001),3)} x`]
        ], 'A composição de BDI deve seguir critérios contratuais, tributários e administrativos do orçamento.');
      }
    },
    unitComposition: {
      fields: () => [
        field('material', 'Material', 'R$/un', 45),
        field('labor', 'Mão de obra', 'R$/un', 28),
        field('equipment', 'Equipamento', 'R$/un', 12),
        field('other', 'Outros custos', 'R$/un', 5),
        field('loss', 'Perdas', '%', 8),
        field('bdi', 'BDI', '%', 22)
      ],
      calculate: (v) => {
        const direct = (v.material+v.labor+v.equipment+v.other)*(1+v.loss/100);
        const price = direct*(1+v.bdi/100);
        return result('Preço unitário com BDI', money(price), [
          ['Custo direto com perdas', money(direct)],
          ['BDI aplicado', money(price-direct)],
          ['Material', money(v.material)],
          ['Mão de obra', money(v.labor)],
          ['Equipamentos', money(v.equipment)]
        ], 'Utilize bases oficiais ou próprias e revise produtividade, coeficientes e encargos.');
      }
    },
    mobilization: {
      fields: () => [
        field('equipmentTrips', 'Viagens de equipamentos', 'un', 4),
        field('tripCost', 'Custo por viagem', 'R$/un', 3800),
        field('teamDays', 'Diárias de equipe', 'diárias', 18),
        field('dailyCost', 'Custo por diária', 'R$/dia', 260),
        field('setupCost', 'Instalação de canteiro', 'R$', 12000),
        field('demobilizationFactor', 'Desmobilização', '%', 60)
      ],
      calculate: (v) => {
        const mob = v.equipmentTrips*v.tripCost + v.teamDays*v.dailyCost + v.setupCost;
        const total = mob*(1+v.demobilizationFactor/100);
        return result('Mobilização + desmobilização', money(total), [
          ['Mobilização', money(mob)],
          ['Desmobilização estimada', money(mob*v.demobilizationFactor/100)],
          ['Transporte equipamentos', money(v.equipmentTrips*v.tripCost)],
          ['Equipe', money(v.teamDays*v.dailyCost)]
        ], 'Inclua escolta, licenças, estadias, içamentos, seguros, carga/descarga e restrições logísticas.');
      }
    },
    dailyOverhead: {
      fields: () => [
        field('staff', 'Equipe administrativa', 'R$/mês', 45000),
        field('siteFacilities', 'Canteiro / instalações', 'R$/mês', 18000),
        field('vehicles', 'Veículos e apoio', 'R$/mês', 12000),
        field('utilities', 'Utilidades e comunicação', 'R$/mês', 5000),
        field('duration', 'Duração da obra', 'meses', 8)
      ],
      calculate: (v) => {
        const month = v.staff+v.siteFacilities+v.vehicles+v.utilities;
        const total = month*v.duration;
        return result('Administração local total', money(total), [
          ['Custo mensal', money(month)],
          ['Custo diário médio', money(month/22)],
          ['Duração', `${format(v.duration,1)} meses`]
        ], 'Administração local deve ser rateada conforme prazo, recursos permanentes, contratos e histograma de mão de obra.');
      }
    },
    materialLoss: {
      fields: () => [
        field('quantity', 'Quantidade líquida', 'un', 1250),
        field('loss', 'Perdas', '%', 7),
        field('packageSize', 'Embalagem comercial', 'un/emb', 50),
        field('reserve', 'Reserva técnica', '%', 3),
        field('unitCost', 'Custo unitário', 'R$/un', 8.5)
      ],
      calculate: (v) => {
        const gross = v.quantity*(1+v.loss/100)*(1+v.reserve/100);
        const packages = ceil(gross/Math.max(v.packageSize,1));
        const buy = packages*v.packageSize;
        return result('Quantidade de compra', `${format(buy,0)} un`, [
          ['Quantidade com perdas', `${format(gross,0)} un`],
          ['Embalagens', `${packages} un`],
          ['Sobra estimada', `${format(buy-gross,0)} un`],
          ['Custo total', money(buy*v.unitCost)]
        ], 'Arredondamento comercial evita ruptura, mas deve ser controlado para reduzir estoque parado.');
      }
    },
    scheduleFinance: {
      fields: () => [
        field('totalCost', 'Custo total da obra', 'R$', 500000),
        field('duration', 'Prazo', 'meses', 10),
        field('advanceStart', 'Avanço inicial', '%', 5),
        field('advanceEnd', 'Avanço final', '%', 8),
        field('retention', 'Retenção contratual', '%', 5)
      ],
      calculate: (v) => {
        const middle = Math.max(100-v.advanceStart-v.advanceEnd,0);
        const monthly = middle/Math.max(v.duration-2,1);
        const retained = v.totalCost*v.retention/100;
        return result('Desembolso médio mensal', money(v.totalCost/Math.max(v.duration,1)), [
          ['Mês inicial', `${format(v.advanceStart,1)}% / ${money(v.totalCost*v.advanceStart/100)}`],
          ['Meses intermediários', `${format(monthly,1)}% ao mês`],
          ['Mês final', `${format(v.advanceEnd,1)}% / ${money(v.totalCost*v.advanceEnd/100)}`],
          ['Retenção contratual', money(retained)]
        ], 'Cronograma financeiro deve refletir curva real de avanço, medições, retenções e desembolsos de suprimentos.');
      }
    },

    mortarLayer: {
      fields: () => [
        field('area', 'Área de revestimento', 'm²', 120),
        field('thickness', 'Espessura média', 'cm', 2),
        field('cementPart', 'Cimento — parte', 'parte', 1),
        field('sandPart', 'Areia — parte', 'parte', 5),
        field('dryFactor', 'Fator volume seco', 'x', 1.35),
        field('waste', 'Perdas', '%', 10),
        field('bagWeight', 'Peso do saco', 'kg', 50),
        field('cementDensity', 'Densidade cimento', 'kg/m³', 1440),
        field('cementBagCost', 'Custo saco cimento', 'R$/un', 38),
        field('sandCost', 'Custo areia', 'R$/m³', 120)
      ],
      calculate: (v) => {
        const wet = v.area * v.thickness / 100;
        const total = wet * (1 + v.waste / 100) * Math.max(v.dryFactor, 1);
        const parts = Math.max(v.cementPart + v.sandPart, .01);
        const cementVol = total * v.cementPart / parts;
        const sandVol = total * v.sandPart / parts;
        const cementKg = cementVol * Math.max(v.cementDensity, 1);
        const bags = ceil(cementKg / Math.max(v.bagWeight, 1));
        const cost = bags * v.cementBagCost + sandVol * v.sandCost;
        return result('Volume de argamassa com perdas', `${format(total)} m³`, [
          ['Volume úmido', `${format(wet)} m³`],
          ['Traço C:A', `${format(v.cementPart,0)}:${format(v.sandPart,0)}`],
          ['Cimento', `${format(cementKg,0)} kg`],
          ['Sacos de cimento', `${bags} un`],
          ['Areia', `${format(sandVol)} m³`],
          ['Custo estimado', money(cost)]
        ], 'Consumo estimado. Ajuste conforme prumo, absorção da base, desperdício e método executivo.');
      }
    },
    screedFloor: {
      fields: () => [
        field('area', 'Área do contrapiso', 'm²', 80),
        field('thickness', 'Espessura média', 'cm', 4),
        field('cementPart', 'Cimento — parte', 'parte', 1),
        field('sandPart', 'Areia — parte', 'parte', 3),
        field('dryFactor', 'Fator volume seco', 'x', 1.35),
        field('waste', 'Perdas', '%', 8),
        field('cementBagCost', 'Custo saco cimento', 'R$/un', 38),
        field('sandCost', 'Custo areia', 'R$/m³', 120)
      ],
      calculate: (v) => {
        const wet = v.area * v.thickness / 100;
        const total = wet * Math.max(v.dryFactor, 1) * (1 + v.waste / 100);
        const cementVol = total * v.cementPart / Math.max(v.cementPart + v.sandPart, .01);
        const sandVol = total - cementVol;
        const bags = ceil(cementVol * 1440 / 50);
        const cost = bags * v.cementBagCost + sandVol * v.sandCost;
        return result('Volume de argamassa seca', `${format(total)} m³`, [
          ['Volume geométrico', `${format(wet)} m³`],
          ['Cimento', `${bags} sacos`],
          ['Areia', `${format(sandVol)} m³`],
          ['Espessura média', `${format(v.thickness)} cm`],
          ['Custo estimado', money(cost)]
        ], 'Para contrapiso, considere caimentos, taliscas, juntas, cura e regularidade exigida pelo revestimento.');
      }
    },
    layingMortar: {
      fields: () => [
        field('wallArea', 'Área de alvenaria', 'm²', 100),
        field('consumption', 'Consumo de argamassa', 'm³/m²', 0.018),
        field('waste', 'Perdas', '%', 10),
        field('cementPart', 'Cimento — parte', 'parte', 1),
        field('sandPart', 'Areia — parte', 'parte', 6),
        field('cementBagCost', 'Custo saco cimento', 'R$/un', 38),
        field('sandCost', 'Custo areia', 'R$/m³', 120)
      ],
      calculate: (v) => {
        const volume = v.wallArea * v.consumption * (1 + v.waste / 100);
        const cementVol = volume * v.cementPart / Math.max(v.cementPart + v.sandPart, .01);
        const sandVol = volume - cementVol;
        const bags = ceil(cementVol * 1440 / 50);
        return result('Argamassa de assentamento', `${format(volume)} m³`, [
          ['Consumo adotado', `${format(v.consumption,3)} m³/m²`],
          ['Cimento', `${bags} sacos`],
          ['Areia', `${format(sandVol)} m³`],
          ['Custo estimado', money(bags * v.cementBagCost + sandVol * v.sandCost)]
        ], 'Consumo varia conforme bloco, espessura da junta, perdas, produtividade e qualidade da mão de obra.');
      }
    },
    grout: {
      fields: () => [
        field('area', 'Área revestida', 'm²', 60),
        field('pieceW', 'Largura da peça', 'cm', 60),
        field('pieceH', 'Altura da peça', 'cm', 60),
        field('joint', 'Largura da junta', 'mm', 3),
        field('depth', 'Profundidade da junta', 'mm', 6),
        field('density', 'Densidade do rejunte', 'kg/L', 1.7),
        field('waste', 'Perdas', '%', 10),
        field('packageWeight', 'Embalagem', 'kg', 5),
        field('packageCost', 'Custo embalagem', 'R$/un', 32)
      ],
      calculate: (v) => {
        const w = v.pieceW / 100, h = v.pieceH / 100;
        const jointM = v.joint / 1000, depthM = v.depth / 1000;
        const jointsPerM2 = (1 / Math.max(w, .001)) + (1 / Math.max(h, .001));
        const volumeM3 = v.area * jointsPerM2 * jointM * depthM * (1 + v.waste / 100);
        const kg = volumeM3 * 1000 * v.density;
        const packs = ceil(kg / Math.max(v.packageWeight, .1));
        return result('Consumo de rejunte', `${format(kg)} kg`, [
          ['Comprimento de juntas', `${format(v.area * jointsPerM2)} m`],
          ['Volume de juntas', `${format(volumeM3 * 1000)} L`],
          ['Embalagens', `${packs} un`],
          ['Custo estimado', money(packs * v.packageCost)]
        ]);
      }
    },
    coatingMass: {
      fields: () => [
        field('area', 'Área de aplicação', 'm²', 150),
        field('coats', 'Demãos', 'un', 2),
        field('coverage', 'Rendimento', 'm²/kg/demão', 1.8),
        field('waste', 'Perdas', '%', 8),
        field('packageWeight', 'Embalagem', 'kg', 25),
        field('packageCost', 'Custo embalagem', 'R$/un', 85)
      ],
      calculate: (v) => {
        const kg = v.area * v.coats / Math.max(v.coverage, .001) * (1 + v.waste / 100);
        const packs = ceil(kg / Math.max(v.packageWeight, .1));
        return result('Massa necessária', `${format(kg)} kg`, [
          ['Área equivalente', `${format(v.area * v.coats)} m²·demão`],
          ['Embalagens', `${packs} un`],
          ['Custo estimado', money(packs * v.packageCost)]
        ]);
      }
    },
    waterproofing: {
      fields: () => [
        field('area', 'Área impermeabilizada', 'm²', 90),
        field('coats', 'Demãos / camadas', 'un', 2),
        field('consumption', 'Consumo por demão', 'kg/m²', 1.2),
        field('primer', 'Primer', 'L/m²', 0.3),
        field('waste', 'Perdas', '%', 10),
        field('productCost', 'Custo produto', 'R$/kg', 9.5),
        field('primerCost', 'Custo primer', 'R$/L', 16)
      ],
      calculate: (v) => {
        const kg = v.area * v.coats * v.consumption * (1 + v.waste / 100);
        const primerL = v.area * v.primer * (1 + v.waste / 100);
        return result('Impermeabilizante', `${format(kg)} kg`, [
          ['Primer', `${format(primerL)} L`],
          ['Área total aplicada', `${format(v.area * v.coats)} m²·demão`],
          ['Custo impermeabilizante', money(kg * v.productCost)],
          ['Custo primer', money(primerL * v.primerCost)],
          ['Custo total', money(kg * v.productCost + primerL * v.primerCost)]
        ], 'Inclua tratamento de ralos, rodapés, cantos, juntas, teste de estanqueidade e recomendações do fabricante.');
      }
    },
    formwork: {
      fields: () => [
        field('perimeter', 'Perímetro da peça', 'm', 1.6),
        field('height', 'Altura / comprimento', 'm', 3),
        field('pieces', 'Quantidade de peças', 'un', 12),
        field('reuse', 'Reaproveitamento', 'vezes', 4),
        field('waste', 'Perdas', '%', 10),
        field('sheetArea', 'Área da chapa', 'm²', 2.98),
        field('sheetCost', 'Custo chapa', 'R$/un', 180)
      ],
      calculate: (v) => {
        const gross = v.perimeter * v.height * v.pieces;
        const net = gross / Math.max(v.reuse, 1) * (1 + v.waste / 100);
        const sheets = ceil(net / Math.max(v.sheetArea, .1));
        return result('Área de forma para compra', `${format(net)} m²`, [
          ['Área bruta de contato', `${format(gross)} m²`],
          ['Reaproveitamento', `${format(v.reuse,0)} vezes`],
          ['Chapas estimadas', `${sheets} un`],
          ['Custo estimado', money(sheets * v.sheetCost)]
        ], 'Considere travamentos, sarrafos, desmoldante, escoramento e projeto de formas conforme esforço real.');
      }
    },
    slabFormwork: {
      fields: () => [
        field('area', 'Área da laje', 'm²', 120),
        field('reuse', 'Reaproveitamento', 'vezes', 3),
        field('waste', 'Perdas', '%', 12),
        field('sheetArea', 'Área da chapa', 'm²', 2.98),
        field('sheetCost', 'Custo chapa', 'R$/un', 180),
        field('joistSpacing', 'Espaçamento barrotes', 'm', 0.5)
      ],
      calculate: (v) => {
        const purchaseArea = v.area / Math.max(v.reuse, 1) * (1 + v.waste / 100);
        const sheets = ceil(purchaseArea / Math.max(v.sheetArea, .1));
        const joists = v.area / Math.max(v.joistSpacing, .1);
        return result('Área de forma para laje', `${format(purchaseArea)} m²`, [
          ['Chapas estimadas', `${sheets} un`],
          ['Barrotes aproximados', `${format(joists)} m`],
          ['Custo chapas', money(sheets * v.sheetCost)]
        ]);
      }
    },
    shoring: {
      fields: () => [
        field('area', 'Área da laje', 'm²', 120),
        field('spacingX', 'Espaçamento X', 'm', 1.2),
        field('spacingY', 'Espaçamento Y', 'm', 1.2),
        field('reserve', 'Reserva técnica', '%', 10),
        field('rentalCost', 'Locação por escora/dia', 'R$/dia', 2.5),
        field('days', 'Prazo de locação', 'dias', 21)
      ],
      calculate: (v) => {
        const props = ceil(v.area / Math.max(v.spacingX * v.spacingY, .01) * (1 + v.reserve / 100));
        return result('Escoras necessárias', `${props} un`, [
          ['Área por escora', `${format(v.spacingX * v.spacingY)} m²`],
          ['Prazo de locação', `${format(v.days,0)} dias`],
          ['Custo de locação', money(props * v.rentalCost * v.days)]
        ], 'Dimensionamento de escoramento deve ser verificado por profissional habilitado conforme cargas, altura e sistema adotado.');
      }
    },
    curing: {
      fields: () => [
        field('area', 'Área de concreto', 'm²', 300),
        field('consumption', 'Consumo produto cura', 'L/m²', 0.2),
        field('coats', 'Aplicações', 'un', 1),
        field('waste', 'Perdas', '%', 8),
        field('productCost', 'Custo produto', 'R$/L', 14)
      ],
      calculate: (v) => {
        const liters = v.area * v.consumption * v.coats * (1 + v.waste / 100);
        return result('Produto de cura', `${format(liters)} L`, [
          ['Área tratada', `${format(v.area)} m²`],
          ['Aplicações', `${format(v.coats,0)} un`],
          ['Custo estimado', money(liters * v.productCost)]
        ]);
      }
    },
    floorJoints: {
      fields: () => [
        field('area', 'Área do piso', 'm²', 600),
        field('panelX', 'Malha de junta X', 'm', 4),
        field('panelY', 'Malha de junta Y', 'm', 4),
        field('sealantConsumption', 'Selante', 'L/m', 0.08),
        field('dowelSpacing', 'Espaçamento barras', 'm', 0.3),
        field('sealantCost', 'Custo selante', 'R$/L', 28)
      ],
      calculate: (v) => {
        const side = Math.sqrt(Math.max(v.area, 0));
        const linesX = Math.max(0, Math.floor(side / Math.max(v.panelX, .1)) - 1);
        const linesY = Math.max(0, Math.floor(side / Math.max(v.panelY, .1)) - 1);
        const length = linesX * side + linesY * side;
        const sealant = length * v.sealantConsumption;
        const dowels = ceil(length / Math.max(v.dowelSpacing, .05));
        return result('Comprimento de juntas', `${format(length)} m`, [
          ['Selante', `${format(sealant)} L`],
          ['Barras de transferência', `${dowels} un`],
          ['Custo selante', money(sealant * v.sealantCost)]
        ]);
      }
    },
    rebarCutBend: {
      fields: () => [
        field('totalLength', 'Comprimento teórico', 'm', 850),
        field('commercialLength', 'Barra comercial', 'm', 12),
        field('loss', 'Perda de corte/dobra', '%', 6),
        field('weightPerM', 'Peso linear', 'kg/m', 0.617),
        field('steelCost', 'Custo aço', 'R$/kg', 7.2)
      ],
      calculate: (v) => {
        const adjusted = v.totalLength * (1 + v.loss / 100);
        const bars = ceil(adjusted / Math.max(v.commercialLength, .1));
        const purchasedLength = bars * v.commercialLength;
        const scrap = purchasedLength - adjusted;
        const kg = purchasedLength * v.weightPerM;
        return result('Barras comerciais', `${bars} un`, [
          ['Comprimento comprado', `${format(purchasedLength)} m`],
          ['Sobra estimada', `${format(scrap)} m`],
          ['Peso comprado', `${format(kg)} kg`],
          ['Custo estimado', money(kg * v.steelCost)]
        ]);
      }
    },
    linearPipeCost: {
      fields: () => [
        field('length', 'Comprimento de rede', 'm', 80),
        field('loss', 'Perdas', '%', 8),
        field('supportsSpacing', 'Espaçamento suportes', 'm', 1.5),
        field('connectionsPer10m', 'Conexões a cada 10 m', 'un', 2),
        field('pipeCost', 'Custo tubo', 'R$/m', 18),
        field('connectionCost', 'Custo conexão', 'R$/un', 12),
        field('supportCost', 'Custo suporte', 'R$/un', 6)
      ],
      calculate: (v) => {
        const pipe = v.length * (1 + v.loss / 100);
        const supports = ceil(v.length / Math.max(v.supportsSpacing, .1)) + 1;
        const connections = ceil(v.length / 10 * v.connectionsPer10m);
        const cost = pipe * v.pipeCost + supports * v.supportCost + connections * v.connectionCost;
        return result('Tubulação para compra', `${format(pipe)} m`, [
          ['Suportes', `${supports} un`],
          ['Conexões estimadas', `${connections} un`],
          ['Custo estimado', money(cost)]
        ]);
      }
    },
    sewerSlope: {
      fields: () => [
        field('length', 'Comprimento do trecho', 'm', 35),
        field('slope', 'Declividade', '%', 1.5),
        field('initialInvert', 'Cota inicial', 'm', 100),
        field('pipeCost', 'Custo tubo instalado', 'R$/m', 95)
      ],
      calculate: (v) => {
        const drop = v.length * v.slope / 100;
        const final = v.initialInvert - drop;
        return result('Desnível necessário', `${format(drop)} m`, [
          ['Cota inicial', `${format(v.initialInvert)} m`],
          ['Cota final', `${format(final)} m`],
          ['Declividade', `${format(v.slope)} %`],
          ['Custo estimado', money(v.length * v.pipeCost)]
        ], 'Verifique diâmetro, vazão, caixas de inspeção, recobrimento e normas locais de saneamento.');
      }
    },
    drainage: {
      fields: () => [
        field('length', 'Comprimento da drenagem', 'm', 60),
        field('trenchW', 'Largura da vala', 'm', 0.6),
        field('trenchD', 'Profundidade média', 'm', 0.8),
        field('pipeCost', 'Custo tubo drenante', 'R$/m', 42),
        field('gravelThickness', 'Espessura de brita', 'm', 0.25),
        field('gravelCost', 'Custo brita', 'R$/m³', 145)
      ],
      calculate: (v) => {
        const excavation = v.length * v.trenchW * v.trenchD;
        const gravel = v.length * v.trenchW * v.gravelThickness;
        return result('Volume de escavação', `${format(excavation)} m³`, [
          ['Tubo drenante', `${format(v.length)} m`],
          ['Brita drenante', `${format(gravel)} m³`],
          ['Custo tubo', money(v.length * v.pipeCost)],
          ['Custo brita', money(gravel * v.gravelCost)],
          ['Custo total', money(v.length * v.pipeCost + gravel * v.gravelCost)]
        ]);
      }
    },
    conduitCable: {
      fields: () => [
        field('circuits', 'Circuitos', 'un', 6),
        field('averageLength', 'Comprimento médio', 'm', 25),
        field('wiresPerCircuit', 'Condutores por circuito', 'un', 3),
        field('loss', 'Perdas', '%', 10),
        field('conduitCost', 'Custo eletroduto', 'R$/m', 4.8),
        field('cableCost', 'Custo cabo', 'R$/m', 2.9)
      ],
      calculate: (v) => {
        const conduit = v.circuits * v.averageLength * (1 + v.loss / 100);
        const cable = conduit * v.wiresPerCircuit;
        return result('Eletroduto estimado', `${format(conduit)} m`, [
          ['Cabo estimado', `${format(cable)} m`],
          ['Circuitos', `${format(v.circuits,0)} un`],
          ['Custo eletroduto', money(conduit * v.conduitCost)],
          ['Custo cabo', money(cable * v.cableCost)],
          ['Custo total', money(conduit * v.conduitCost + cable * v.cableCost)]
        ], 'Pré-dimensionamento. Seção dos cabos e proteção devem ser definidos conforme NBR 5410 e projeto elétrico.');
      }
    },
    electricalLoad: {
      fields: () => [
        field('power', 'Potência total', 'W', 7500),
        field('voltage', 'Tensão', 'V', 220),
        field('demandFactor', 'Fator de demanda', '%', 80),
        field('powerFactor', 'Fator de potência', 'fp', 0.92),
        field('reserve', 'Reserva', '%', 20)
      ],
      calculate: (v) => {
        const demandPower = v.power * v.demandFactor / 100 * (1 + v.reserve / 100);
        const current = demandPower / Math.max(v.voltage * v.powerFactor, .001);
        const breaker = [10,16,20,25,32,40,50,63,80,100,125,160].find(x => x >= current) || ceil(current);
        return result('Corrente estimada', `${format(current)} A`, [
          ['Potência demandada', `${format(demandPower,0)} W`],
          ['Disjuntor comercial sugerido', `${breaker} A`],
          ['Fator de potência', `${format(v.powerFactor,2)}`]
        ], 'Sugestão preliminar. Confirmar método de instalação, seção do cabo, queda de tensão, curto-circuito e normas aplicáveis.');
      }
    },
    solarBasic: {
      fields: () => [
        field('monthlyConsumption', 'Consumo mensal', 'kWh/mês', 850),
        field('sunHours', 'Horas de sol pleno', 'h/dia', 4.8),
        field('performanceRatio', 'Performance ratio', '%', 78),
        field('panelPower', 'Potência do módulo', 'W', 550),
        field('reserve', 'Reserva', '%', 10)
      ],
      calculate: (v) => {
        const daily = v.monthlyConsumption / 30;
        const kwp = daily / Math.max(v.sunHours * v.performanceRatio / 100, .001) * (1 + v.reserve / 100);
        const panels = ceil(kwp * 1000 / Math.max(v.panelPower, 1));
        return result('Potência fotovoltaica', `${format(kwp,2)} kWp`, [
          ['Consumo diário médio', `${format(daily)} kWh/dia`],
          ['Módulos estimados', `${panels} un`],
          ['Potência por módulo', `${format(v.panelPower,0)} W`]
        ], 'Pré-dimensionamento. Projeto solar deve considerar área disponível, orientação, sombreamento, inversor, normas e concessionária.');
      }
    },
    wasteBins: {
      fields: () => [
        field('volume', 'Volume de resíduo', 'm³', 42),
        field('bulking', 'Empolamento', '%', 20),
        field('binCapacity', 'Capacidade da caçamba', 'm³', 5),
        field('reserve', 'Reserva', '%', 10),
        field('binCost', 'Custo por caçamba', 'R$/un', 450)
      ],
      calculate: (v) => {
        const finalVolume = v.volume * (1 + v.bulking / 100) * (1 + v.reserve / 100);
        const bins = ceil(finalVolume / Math.max(v.binCapacity, .1));
        return result('Caçambas necessárias', `${bins} un`, [
          ['Volume final', `${format(finalVolume)} m³`],
          ['Capacidade por caçamba', `${format(v.binCapacity)} m³`],
          ['Custo estimado', money(bins * v.binCost)]
        ]);
      }
    },
    earthworkSections: {
      fields: () => [
        field('areaA', 'Área da seção inicial', 'm²', 18),
        field('areaB', 'Área da seção final', 'm²', 26),
        field('distance', 'Distância entre seções', 'm', 20),
        field('bulking', 'Empolamento / compactação', '%', 15),
        field('unitCost', 'Custo terraplenagem', 'R$/m³', 28)
      ],
      calculate: (v) => {
        const natural = (v.areaA + v.areaB) / 2 * v.distance;
        const adjusted = natural * (1 + v.bulking / 100);
        return result('Volume por áreas médias', `${format(adjusted)} m³`, [
          ['Volume natural', `${format(natural)} m³`],
          ['Fator aplicado', `${format(v.bulking)} %`],
          ['Custo estimado', money(adjusted * v.unitCost)]
        ]);
      }
    },
    asphaltPaving: {
      fields: () => [
        field('area', 'Área pavimentada', 'm²', 1000),
        field('thickness', 'Espessura CBUQ', 'cm', 5),
        field('density', 'Densidade CBUQ', 't/m³', 2.35),
        field('loss', 'Perdas', '%', 5),
        field('asphaltCost', 'Custo CBUQ', 'R$/t', 520),
        field('tackCoat', 'Pintura de ligação', 'L/m²', 0.5),
        field('tackCost', 'Custo emulsão', 'R$/L', 4.8)
      ],
      calculate: (v) => {
        const volume = v.area * v.thickness / 100;
        const tons = volume * v.density * (1 + v.loss / 100);
        const tack = v.area * v.tackCoat;
        return result('Massa asfáltica', `${format(tons)} t`, [
          ['Volume geométrico', `${format(volume)} m³`],
          ['Pintura de ligação', `${format(tack)} L`],
          ['Custo CBUQ', money(tons * v.asphaltCost)],
          ['Custo pintura', money(tack * v.tackCost)],
          ['Custo total', money(tons * v.asphaltCost + tack * v.tackCost)]
        ]);
      }
    },
    concretePaving: {
      fields: () => [
        field('area', 'Área do pavimento', 'm²', 800),
        field('thickness', 'Espessura', 'cm', 12),
        field('loss', 'Perdas', '%', 6),
        field('concreteCost', 'Custo concreto', 'R$/m³', 520),
        field('jointPanel', 'Malha de juntas', 'm', 4),
        field('meshCost', 'Tela/armadura', 'R$/m²', 18)
      ],
      calculate: (v) => {
        const volume = v.area * v.thickness / 100 * (1 + v.loss / 100);
        const side = Math.sqrt(v.area);
        const joints = 2 * Math.max(0, Math.floor(side / Math.max(v.jointPanel,.1)) - 1) * side;
        return result('Concreto do pavimento', `${format(volume)} m³`, [
          ['Comprimento de juntas', `${format(joints)} m`],
          ['Tela / armadura', `${format(v.area)} m²`],
          ['Custo concreto', money(volume * v.concreteCost)],
          ['Custo tela', money(v.area * v.meshCost)],
          ['Custo total', money(volume * v.concreteCost + v.area * v.meshCost)]
        ]);
      }
    },
    liftingProduction: {
      fields: () => [
        field('loads', 'Quantidade de içamentos', 'un', 40),
        field('cycleTime', 'Tempo por ciclo', 'min', 12),
        field('efficiency', 'Eficiência operacional', '%', 75),
        field('hourCost', 'Custo guindaste/equipe', 'R$/h', 850),
        field('mobilization', 'Mobilização', 'R$', 2500)
      ],
      calculate: (v) => {
        const hours = v.loads * v.cycleTime / 60 / Math.max(v.efficiency / 100, .01);
        const cost = hours * v.hourCost + v.mobilization;
        return result('Tempo de içamento', `${format(hours)} h`, [
          ['Içamentos por hora', `${format(v.loads / Math.max(hours,.001))} un/h`],
          ['Mobilização', money(v.mobilization)],
          ['Custo operacional', money(hours * v.hourCost)],
          ['Custo total', money(cost)]
        ]);
      }
    },
    mixerTruckCycle: {
      fields: () => [
        field('volume', 'Volume de concreto', 'm³', 120),
        field('truckCapacity', 'Capacidade betoneira', 'm³', 8),
        field('cycleTime', 'Ciclo por viagem', 'min', 90),
        field('dischargeRate', 'Descarga/bombeamento', 'm³/h', 35),
        field('workHours', 'Horas disponíveis', 'h', 8),
        field('truckHourCost', 'Custo caminhão', 'R$/h', 260)
      ],
      calculate: (v) => {
        const trips = ceil(v.volume / Math.max(v.truckCapacity, .1));
        const dischargeHours = v.volume / Math.max(v.dischargeRate, .1);
        const trucksNeeded = ceil((trips * v.cycleTime / 60) / Math.max(v.workHours, .1));
        const cost = trips * v.cycleTime / 60 * v.truckHourCost;
        return result('Viagens de betoneira', `${trips} viagens`, [
          ['Caminhões necessários', `${trucksNeeded} un`],
          ['Tempo de descarga', `${format(dischargeHours)} h`],
          ['Custo estimado', money(cost)]
        ]);
      }
    },
    equipmentRental: {
      fields: () => [
        field('dailyRate', 'Diária do equipamento', 'R$/dia', 1200),
        field('days', 'Dias de locação', 'dias', 12),
        field('mobilization', 'Mobilização', 'R$', 1800),
        field('operatorCost', 'Operador por dia', 'R$/dia', 320),
        field('fuelDaily', 'Combustível por dia', 'R$/dia', 450)
      ],
      calculate: (v) => {
        const total = v.days * (v.dailyRate + v.operatorCost + v.fuelDaily) + v.mobilization;
        return result('Custo total de locação', money(total), [
          ['Locação', money(v.days * v.dailyRate)],
          ['Operador', money(v.days * v.operatorCost)],
          ['Combustível', money(v.days * v.fuelDaily)],
          ['Mobilização', money(v.mobilization)]
        ]);
      }
    },
    safetyCosts: {
      fields: () => [
        field('workers', 'Colaboradores', 'un', 25),
        field('epiCost', 'Kit EPI por pessoa', 'R$/un', 280),
        field('signageCost', 'Sinalização', 'R$', 1800),
        field('trainingCost', 'Treinamento por pessoa', 'R$/un', 95),
        field('reserve', 'Reserva técnica', '%', 10)
      ],
      calculate: (v) => {
        const base = v.workers * (v.epiCost + v.trainingCost) + v.signageCost;
        const total = base * (1 + v.reserve / 100);
        return result('Custo de segurança', money(total), [
          ['EPI', money(v.workers * v.epiCost)],
          ['Treinamentos', money(v.workers * v.trainingCost)],
          ['Sinalização', money(v.signageCost)],
          ['Reserva', `${format(v.reserve)} %`]
        ]);
      }
    },
    siteFacilities: {
      fields: () => [
        field('months', 'Prazo da obra', 'meses', 6),
        field('containers', 'Containers / módulos', 'un', 3),
        field('containerMonthly', 'Custo por container/mês', 'R$/mês', 950),
        field('utilitiesMonthly', 'Água, energia e internet', 'R$/mês', 1800),
        field('setupCost', 'Montagem inicial', 'R$', 6500),
        field('maintenanceMonthly', 'Manutenção mensal', 'R$/mês', 600)
      ],
      calculate: (v) => {
        const monthly = v.containers * v.containerMonthly + v.utilitiesMonthly + v.maintenanceMonthly;
        const total = v.setupCost + monthly * v.months;
        return result('Custo do canteiro', money(total), [
          ['Custo mensal', money(monthly)],
          ['Montagem inicial', money(v.setupCost)],
          ['Prazo', `${format(v.months,0)} meses`],
          ['Containers', `${format(v.containers,0)} un`]
        ]);
      }
    },

    greenhouse: {
      fields: (calc) => [
        field('length', 'Comprimento', 'm', 12),
        field('width', 'Largura', 'm', 6),
        field('wallHeight', 'Altura lateral', 'm', 2),
        field('roofHeight', 'Altura da cobertura', 'm', calc.config.arched ? 3 : 1.5),
        field('waste', 'Perdas de cobertura', '%', 10),
        field('unitCost', 'Custo da cobertura', 'R$/m²', 28)
      ],
      calculate: (v, calc) => {
        let cover, volume;
        if (calc.config.arched) {
          const r = v.width / 2;
          cover = Math.PI * r * v.length + 2 * (Math.PI * r ** 2 / 2);
          volume = Math.PI * r ** 2 / 2 * v.length;
        } else {
          const slope = Math.hypot(v.width / 2, v.roofHeight);
          cover = 2 * slope * v.length + 2 * v.wallHeight * v.length + 2 * (v.width * v.wallHeight + v.width * v.roofHeight / 2);
          volume = v.length * v.width * (v.wallHeight + v.roofHeight / 2);
        }
        const adjusted = cover * (1 + v.waste / 100);
        return result('Área de cobertura com perdas', `${format(adjusted)} m²`, [
          ['Área geométrica', `${format(cover)} m²`],
          ['Volume interno', `${format(volume)} m³`],
          ['Custo estimado', money(adjusted * v.unitCost)]
        ]);
      }
    },
    clamp: {
      fields: () => [
        field('insideWidth', 'Largura interna', 'mm', 100),
        field('leg', 'Comprimento de cada perna', 'mm', 180),
        field('diameter', 'Diâmetro da barra', 'mm', 10),
        field('count', 'Quantidade', 'un', 30),
        field('unitCost', 'Custo do aço', 'R$/kg', 7.8)
      ],
      calculate: (v) => {
        const radius = v.insideWidth / 2 + v.diameter / 2;
        const eachM = (2 * v.leg + Math.PI * radius) / 1000;
        const weight = eachM * v.count * v.diameter ** 2 / 162;
        return result('Comprimento por grampo', `${format(eachM, 3)} m`, [
          ['Comprimento total', `${format(eachM * v.count)} m`],
          ['Peso total', `${format(weight, 1)} kg`],
          ['Custo estimado', money(weight * v.unitCost)]
        ]);
      }
    },
    lighting: {
      fields: () => [
        field('area', 'Área do ambiente', 'm²', 80),
        field('lux', 'Iluminância desejada', 'lux', 300),
        field('lumens', 'Fluxo por luminária', 'lm', 4000),
        field('utilization', 'Fator de utilização', '%', 70),
        field('maintenance', 'Fator de manutenção', '%', 80),
        field('unitCost', 'Custo por luminária', 'R$/un', 220)
      ],
      calculate: (v) => {
        const effective = v.lumens * v.utilization / 100 * v.maintenance / 100;
        const count = ceil(v.area * v.lux / Math.max(effective, 1));
        return result('Quantidade de luminárias', `${count} un`, [
          ['Fluxo total instalado', `${format(count * v.lumens, 0)} lm`],
          ['Potência luminosa efetiva', `${format(effective, 0)} lm/un`],
          ['Custo estimado', money(count * v.unitCost)]
        ], 'O projeto luminotécnico deve considerar layout, refletâncias, ofuscamento, altura de montagem e normas do ambiente.');
      }
    },
    loan: {
      fields: () => [
        field('principal', 'Valor financiado', 'R$', 250000),
        field('rate', 'Taxa de juros mensal', '% a.m.', 1.2),
        field('months', 'Prazo', 'meses', 60),
        field('downPayment', 'Entrada', 'R$', 50000)
      ],
      calculate: (v) => {
        const financed = Math.max(0, v.principal - v.downPayment);
        const i = v.rate / 100;
        const n = Math.max(1, Math.round(v.months));
        const payment = i === 0 ? financed / n : financed * i * (1 + i) ** n / ((1 + i) ** n - 1);
        const total = payment * n + v.downPayment;
        return result('Parcela estimada', money(payment), [
          ['Valor financiado', money(financed)],
          ['Total das parcelas', money(payment * n)],
          ['Juros totais', money(payment * n - financed)],
          ['Desembolso total', money(total)]
        ], 'Simulação financeira simplificada pelo sistema Price, sem seguros, tarifas, impostos ou correções adicionais.');
      }
    },
    cabinet: {
      fields: () => [
        field('width', 'Largura externa', 'm', 2.4),
        field('height', 'Altura externa', 'm', 2.2),
        field('depth', 'Profundidade', 'm', 0.6),
        field('shelves', 'Prateleiras internas', 'un', 5),
        field('doors', 'Portas', 'un', 4),
        field('waste', 'Perdas de corte', '%', 15),
        field('unitCost', 'Custo da chapa', 'R$/m²', 115)
      ],
      calculate: (v) => {
        const carcass = 2 * v.height * v.depth + 2 * v.width * v.depth + v.width * v.height;
        const shelves = v.shelves * v.width * v.depth;
        const doors = v.doors * (v.width / Math.max(v.doors, 1)) * v.height;
        const area = (carcass + shelves + doors) * (1 + v.waste / 100);
        return result('Área de chapas com perdas', `${format(area)} m²`, [
          ['Carcaça e fundo', `${format(carcass)} m²`],
          ['Prateleiras', `${format(shelves)} m²`],
          ['Portas', `${format(doors)} m²`],
          ['Fita de borda aproximada', `${format(2 * (v.width + v.height) + 2 * v.shelves * v.width)} m`],
          ['Custo estimado', money(area * v.unitCost)]
        ]);
      }
    },
    drawer: {
      fields: () => [
        field('width', 'Largura externa', 'cm', 60),
        field('height', 'Altura externa', 'cm', 18),
        field('depth', 'Profundidade externa', 'cm', 45),
        field('thickness', 'Espessura da chapa', 'mm', 15),
        field('count', 'Quantidade de gavetas', 'un', 4),
        field('unitCost', 'Custo da chapa', 'R$/m²', 115)
      ],
      calculate: (v) => {
        const w = v.width / 100, h = v.height / 100, d = v.depth / 100;
        const each = 2 * d * h + 2 * w * h + w * d;
        const total = each * v.count * 1.12;
        return result('Área total de chapas', `${format(total)} m²`, [
          ['Área por gaveta', `${format(each)} m²`],
          ['Largura interna', `${format(v.width - 2 * v.thickness / 10, 1)} cm`],
          ['Altura interna', `${format(v.height - v.thickness / 10, 1)} cm`],
          ['Custo estimado', money(total * v.unitCost)]
        ]);
      }
    },
    arch: {
      fields: () => [
        field('chord', 'Comprimento da corda', 'm', 3),
        field('rise', 'Flecha do arco', 'm', 0.6),
        field('count', 'Quantidade', 'un', 1),
        field('unitCost', 'Custo por metro', 'R$/m', 80)
      ],
      calculate: (v) => {
        const radius = (v.chord ** 2) / (8 * Math.max(v.rise, .001)) + v.rise / 2;
        const angle = 2 * Math.asin(clamp(v.chord / (2 * radius), -1, 1));
        const arc = radius * angle;
        return result('Comprimento do arco', `${format(arc)} m`, [
          ['Raio', `${format(radius)} m`],
          ['Ângulo central', `${format(angle * 180 / Math.PI, 1)}°`],
          ['Comprimento total', `${format(arc * v.count)} m`],
          ['Custo estimado', money(arc * v.count * v.unitCost)]
        ]);
      }
    },
    trapezoid: {
      fields: () => [
        field('baseA', 'Base maior', 'cm', 80),
        field('baseB', 'Base menor', 'cm', 50),
        field('height', 'Altura', 'cm', 40),
        field('count', 'Quantidade', 'un', 1),
        field('unitCost', 'Custo por m²', 'R$/m²', 160)
      ],
      calculate: (v) => {
        const offset = Math.abs(v.baseA - v.baseB);
        const diagonal = Math.hypot(v.height, offset);
        const angle = Math.atan2(v.height, Math.max(offset, .001)) * 180 / Math.PI;
        const area = (v.baseA + v.baseB) / 2 * v.height / 10000;
        return result('Área da peça', `${format(area, 3)} m²`, [
          ['Diagonal chanfrada', `${format(diagonal, 1)} cm`],
          ['Ângulo de corte', `${format(angle, 1)}°`],
          ['Área total', `${format(area * v.count, 3)} m²`],
          ['Custo estimado', money(area * v.count * v.unitCost)]
        ]);
      }
    }
  };




  templates.quickEngineering = {
    fields: (calc) => quickEngineeringFields(calc.config.mode),
    calculate: (v, calc) => quickEngineeringCalculate(calc.config.mode, v, calc)
  };

  const state = {
    view: 'home',
    query: '',
    category: 'all',
    sort: 'recommended',
    activeCalculator: null,
    lastResult: null,
    deferredPrompt: null,
    favorites: new Set(JSON.parse(localStorage.getItem(STORAGE.favorites) || '[]')),
    history: JSON.parse(localStorage.getItem(STORAGE.history) || '[]'),
    currentInputs: {}
  };

  const $ = (id) => document.getElementById(id);
  const refs = {
    sidebar: $('sidebar'), menuButton: $('menuButton'), search: $('globalSearch'), mirrorSearch: $('catalogSearchMirror'),
    themeButton: $('themeButton'), installButton: $('installButton'), notificationButton: $('notificationButton'),
    featuredGrid: $('featuredGrid'), categoryGrid: $('categoryGrid'), categoryChips: $('categoryChips'), calculatorGrid: $('calculatorGrid'),
    favoritesGrid: $('favoritesGrid'), favoritesEmpty: $('favoritesEmpty'), historyList: $('historyList'), historyEmpty: $('historyEmpty'),
    resultCount: $('resultCount'), calculatorEmpty: $('calculatorEmpty'), sortSelect: $('sortSelect'), clearFiltersButton: $('clearFiltersButton'),
    toastRegion: $('toastRegion'), clearHistoryButton: $('clearHistoryButton'),
    detailCategory: $('detailCategory'), detailTitle: $('detailTitle'), detailDescription: $('detailDescription'), formCardTitle: $('formCardTitle'),
    form: $('calculatorForm'), diagram: $('detailDiagram'), diagramMeta: $('diagramMeta'), diagramNote: $('diagramNote'),
    resultPrimaryLabel: $('resultPrimaryLabel'), resultPrimaryValue: $('resultPrimaryValue'), resultSecondary: $('resultSecondary'),
    materialsTable: $('materialsTable'), memoryList: $('memoryList'), technicalNotes: $('technicalNotes'), validationSummary: $('validationSummary'),
    calculateButton: $('calculateButton'), resetButton: $('resetCalculatorButton'), autoCalcToggle: $('autoCalcToggle'),
    duplicateButton: $('duplicateButton'), printButton: $('printButton'), exportButton: $('exportButton'), saveButton: $('saveButton'),
    detailFavoriteButton: $('detailFavoriteButton'), backToCatalogButton: $('backToCatalogButton'), newEstimateButton: $('newEstimateButton'),
    detailIcon: $('detailIcon'), printMetaDate: $('printMetaDate'), printMetaTitle: $('printMetaTitle'), printIssuedAt: $('printIssuedAt'),
    printCalcName: $('printCalcName'), printCalcCategory: $('printCalcCategory'), printCalcDescription: $('printCalcDescription'),
    printBrandCalcName: $('printBrandCalcName'), printBrandCalcCategory: $('printBrandCalcCategory'), printFooterUrl: $('printFooterUrl'), printSummaryIcon: $('printSummaryIcon')
  };

  const categoryTheme = {
    roofs: '#ff9b29', 'wood-stairs': '#c666ff', 'metal-stairs': '#7f8fff', concrete: '#33c8ff',
    materials: '#ff4f95', 'walls-floors': '#43df92', earthworks: '#f3c23b', volumes: '#27c4ff', production: '#32e6c7', budget: '#f7c948', other: '#a9b7cf', electrical: '#ffd84a', hydraulics: '#38d7ff', mechanical: '#9aa7ff', safety: '#ff7b4a', industrial: '#74e29a', management: '#d88cff'
  };
  const categoryAliases = {
    roofs: 'Telhados e estruturas', 'wood-stairs': 'Escadas de madeira', 'metal-stairs': 'Escadas metálicas',
    concrete: 'Fundações e concreto', materials: 'Pintura, drywall e acabamentos', 'walls-floors': 'Paredes e revestimentos',
    earthworks: 'Terraplenagem e escavação', volumes: 'Volumes e reservatórios', production: 'Produção e máquinas', budget: 'Custos e orçamento', other: 'Instalações e utilidades', electrical: 'Engenharia elétrica', hydraulics: 'Engenharia hidráulica', mechanical: 'Engenharia mecânica', safety: 'Segurança do trabalho', industrial: 'Ambientes industriais', management: 'Gestão geral de obras'
  };

  function categoryById(id) { return categories.find((item) => item.id === id); }
  function calcById(id) { return calculators.find((item) => item.id === id); }
  function categoryName(id) { return categoryAliases[id] || categoryById(id)?.name || id; }
  function persist() {
    localStorage.setItem(STORAGE.favorites, JSON.stringify([...state.favorites]));
    localStorage.setItem(STORAGE.history, JSON.stringify(state.history.slice(0, 80)));
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE.theme, theme);
    refs.themeButton.textContent = theme === 'dark' ? '◐' : '◑';
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    refs.toastRegion.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
  }

  function initialValuesFor(calc) {
    return Object.fromEntries(templates[calc.template].fields(calc).map((f) => [f.name, f.value]));
  }
  function currentValuesFromForm() {
    const fieldDefs = state.activeCalculator ? templates[state.activeCalculator.template].fields(state.activeCalculator) : [];
    const selectNames = new Set(fieldDefs.filter((item) => item.type === 'select').map((item) => item.name));
    return Object.fromEntries([...new FormData(refs.form).entries()].map(([key, value]) => {
      if (selectNames.has(key)) return [key, value];
      return [key, num(value)];
    }));
  }
  function calculateOutput(calc, values) { return templates[calc.template].calculate(values, calc); }
  function safeDetails(output, count = 2) { return (output?.details || []).slice(0, count); }
  function themeColor(calc) { return categoryTheme[calc.category] || '#33b6ff'; }

  function chipStyle(calc) {
    return `style="--chip:${themeColor(calc)}"`;
  }

  function lineArrow(x1,y1,x2,y2,color='#33b6ff') {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2"/>
      <polygon points="${x1},${y1} ${x1+6},${y1-4} ${x1+6},${y1+4}" fill="${color}"/>
      <polygon points="${x2},${y2} ${x2-6},${y2-4} ${x2-6},${y2+4}" fill="${color}"/>`;}

  function diagramSVG(calc, values = initialValuesFor(calc), mini = false) {
    const printView = state.printMode === true;
    const stroke = printView ? '#19afea' : '#34beff';
    const white = printView ? '#142033' : '#edf7ff';
    const muted = printView ? '#7184a0' : '#91a9cc';
    const fill = printView ? 'rgba(25,175,234,.10)' : 'rgba(52,190,255,.14)';
    const view = '0 0 640 420';
    const fs = mini ? 18 : 16;
    const defs = `<defs>
      <pattern id="g-${calc.id}" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="${printView ? 'rgba(115,147,189,.18)' : 'rgba(130,177,235,.12)'}" stroke-width="1"/></pattern>
      <marker id="a-${calc.id}" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 Z" fill="${stroke}"/></marker>
      <linearGradient id="f-${calc.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${printView ? 'rgba(25,175,234,.16)' : 'rgba(52,190,255,.25)'}"/><stop offset="1" stop-color="${printView ? 'rgba(25,175,234,.04)' : 'rgba(31,99,180,.05)'}"/></linearGradient>
    </defs>`;
    const bg = `<rect width="640" height="420" rx="18" fill="${printView ? '#ffffff' : '#0b1423'}"/><rect width="640" height="420" rx="18" fill="url(#g-${calc.id})"/>`;
    const dim = (x1,y1,x2,y2,label,tx=(x1+x2)/2,ty=(y1+y2)/2-10) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="2" marker-start="url(#a-${calc.id})" marker-end="url(#a-${calc.id})"/><text x="${tx}" y="${ty}" text-anchor="middle" fill="${white}" font-size="${fs}" font-weight="700">${label}</text>`;
    const title = (text) => mini ? '' : `<text x="320" y="392" text-anchor="middle" fill="${muted}" font-size="16">${text}</text>`;
    const svg = (body) => `<svg viewBox="${view}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama técnico de ${calc.name}">${defs}${bg}${body}</svg>`;
    const f = (name, fallback=0) => num(values[name] ?? fallback);
    const meter = (v, digits=2) => `${format(v, digits)} m`;

    switch (calc.template) {
      case 'roof': {
        const width=f('width',8), length=f('length',10), pitch=f('pitch',30);
        const rise=Math.tan(pitch*Math.PI/180)*(width/2);
        return svg(`<path d="M120 285 L320 105 L520 285" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="4"/><line x1="105" y1="285" x2="535" y2="285" stroke="${white}" stroke-width="3"/><line x1="320" y1="105" x2="320" y2="285" stroke="${stroke}" stroke-width="2" stroke-dasharray="8 8"/>${dim(120,320,520,320,meter(width),320,350)}${dim(560,105,560,285,meter(rise),590,205)}<path d="M160 285 A45 45 0 0 1 191 251" fill="none" stroke="${white}" stroke-width="2"/><text x="190" y="276" fill="${white}" font-size="${fs}">${format(pitch,0)}°</text><text x="320" y="75" text-anchor="middle" fill="${muted}" font-size="${fs}">Comprimento: ${meter(length)}</text>${title('Geometria da cobertura e inclinação')}`);
      }
      case 'stairs': {
        const h=f('height',2.8), run=f('run',4.2), target=f('targetRiser',17.5);
        const steps=Math.max(2,Math.round(h*100/Math.max(target,10)));
        let d='M110 310';
        const sx=360/steps, sy=220/steps;
        for(let i=0;i<steps;i++) d+=` h${sx} v-${sy}`;
        return svg(`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="4"/><line x1="110" y1="310" x2="500" y2="310" stroke="${white}" stroke-width="2"/><line x1="500" y1="310" x2="500" y2="70" stroke="${white}" stroke-width="2"/>${dim(110,345,500,345,meter(run),305,376)}${dim(545,310,545,70,meter(h),580,198)}<text x="310" y="80" text-anchor="middle" fill="${muted}" font-size="${fs}">${steps} espelhos · ${steps-1} pisos</text>${title('Perfil da escada e relação piso/espelho')}`);
      }
      case 'spiralStairs': {
        const dia=f('diameter',1.8), turns=f('turns',1), h=f('height',2.8);
        let spokes=''; for(let i=0;i<14;i++){const a=i*Math.PI*2/14, x=320+135*Math.cos(a), y=205+80*Math.sin(a);spokes+=`<line x1="320" y1="205" x2="${x}" y2="${y}" stroke="${stroke}" stroke-width="2" opacity="${.35+i/25}"/>`;}
        return svg(`<ellipse cx="320" cy="205" rx="145" ry="88" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><ellipse cx="320" cy="205" rx="28" ry="18" fill="#0b1423" stroke="${white}" stroke-width="2"/>${spokes}<path d="M175 205 C190 80 450 60 465 205 C480 330 210 350 175 205" fill="none" stroke="${white}" stroke-width="3" stroke-dasharray="8 8"/>${dim(175,330,465,330,meter(dia),320,360)}<text x="320" y="85" text-anchor="middle" fill="${muted}" font-size="${fs}">${format(turns,1)} volta(s) · altura ${meter(h)}</text>${title('Planta e desenvolvimento da escada helicoidal')}`);
      }
      case 'stripFoundation': {
        const l=f('length',48), w=f('width',.4), h=f('height',.6);
        return svg(`<path d="M110 260 L440 260 L530 205 L200 205 Z" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><path d="M110 260 L110 315 L440 315 L440 260" fill="${fill}" stroke="${stroke}" stroke-width="3"/><path d="M440 260 L530 205 L530 260 L440 315" fill="rgba(52,190,255,.08)" stroke="${stroke}" stroke-width="3"/>${dim(110,350,440,350,meter(l),275,382)}${dim(465,190,545,145,meter(w),520,145)}${dim(75,260,75,315,meter(h),45,294)}${title('Fundação corrida — comprimento, largura e altura')}`);
      }
      case 'pileFoundation': {
        const count=f('count',20), dia=f('diameter',30), depth=f('depth',6);
        let piles=''; const xs=[170,270,370,470]; for(const x of xs) piles+=`<ellipse cx="${x}" cy="105" rx="34" ry="12" fill="${fill}" stroke="${stroke}" stroke-width="2"/><line x1="${x-34}" y1="105" x2="${x-34}" y2="300" stroke="${stroke}" stroke-width="3"/><line x1="${x+34}" y1="105" x2="${x+34}" y2="300" stroke="${stroke}" stroke-width="3"/><ellipse cx="${x}" cy="300" rx="34" ry="12" fill="none" stroke="${stroke}" stroke-width="2" stroke-dasharray="6 6"/>`;
        return svg(`${piles}${dim(115,105,115,300,meter(depth),75,205)}${dim(136,335,204,335,`${format(dia,0)} cm`,170,365)}<text x="320" y="65" text-anchor="middle" fill="${muted}" font-size="${fs}">${format(count,0)} estacas previstas</text>${title('Distribuição esquemática das estacas')}`);
      }
      case 'slab': case 'floor': case 'tile': case 'decking': {
        const l=f('length',10), w=f('width',8), t=f('thickness',15);
        let gridLines=''; for(let i=1;i<6;i++){gridLines+=`<line x1="${120+i*65}" y1="110" x2="${120+i*65}" y2="300" stroke="${stroke}" opacity=".32"/><line x1="120" y1="${110+i*31}" x2="510" y2="${110+i*31}" stroke="${stroke}" opacity=".32"/>`;}
        return svg(`<rect x="120" y="110" width="390" height="190" rx="4" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/>${gridLines}${dim(120,335,510,335,meter(l),315,368)}${dim(75,110,75,300,meter(w),43,210)}<text x="315" y="90" text-anchor="middle" fill="${muted}" font-size="${fs}">Espessura / camada: ${format(t,1)} ${calc.config?.thin?'mm':'cm'}</text>${title(calc.template==='tile'?'Paginação e área de revestimento':'Área e espessura da camada')}`);
      }
      case 'ring': {
        const outer=f('outer',1.2), inner=f('inner',1), h=f('height',.5);
        return svg(`<ellipse cx="320" cy="105" rx="150" ry="42" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><ellipse cx="320" cy="105" rx="102" ry="28" fill="#0b1423" stroke="${white}" stroke-width="3"/><line x1="170" y1="105" x2="170" y2="292" stroke="${stroke}" stroke-width="3"/><line x1="470" y1="105" x2="470" y2="292" stroke="${stroke}" stroke-width="3"/><ellipse cx="320" cy="292" rx="150" ry="42" fill="none" stroke="${stroke}" stroke-width="3"/><ellipse cx="320" cy="292" rx="102" ry="28" fill="none" stroke="${white}" stroke-width="2" stroke-dasharray="6 6"/>${dim(145,340,495,340,meter(outer),320,372)}${dim(515,105,515,292,meter(h),555,205)}<text x="320" y="70" text-anchor="middle" fill="${muted}" font-size="${fs}">Ø interno ${meter(inner)}</text>${title('Anel de concreto — diâmetros e altura')}`);
      }
      case 'diagonal': case 'trapezoid': {
        const a=f('length',f('baseA',8)), b=f('width',f('height',6));
        return svg(`<path d="M120 300 L500 300 L${calc.template==='trapezoid'?430:500} 100 L120 100 Z" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><line x1="120" y1="300" x2="${calc.template==='trapezoid'?430:500}" y2="100" stroke="${white}" stroke-width="3" stroke-dasharray="8 8"/>${dim(120,340,500,340,`${format(a)} ${calc.template==='trapezoid'?'cm':'m'}`,310,372)}${dim(80,300,80,100,`${format(b)} ${calc.template==='trapezoid'?'cm':'m'}`,42,205)}${title(calc.template==='trapezoid'?'Peça trapezoidal e diagonal de corte':'Verificação de esquadro pela diagonal')}`);
      }
      case 'arch': {
        const chord=f('chord',3), rise=f('rise',.6);
        return svg(`<line x1="130" y1="300" x2="510" y2="300" stroke="${white}" stroke-width="3"/><path d="M130 300 Q320 75 510 300" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="4"/>${dim(130,335,510,335,meter(chord),320,368)}${dim(320,300,320,150,meter(rise),360,225)}${title('Corda, flecha e comprimento do arco')}`);
      }
      case 'concreteMix': {
        const tr = concreteTrace(values); const maxP = Math.max(tr.cement, tr.sand, tr.gravel, 1); const bar = (part) => 40 + 190 * part / maxP;
        return svg(`<g transform="translate(80,75)"><rect x="0" y="${250-bar(tr.cement)}" width="105" height="${bar(tr.cement)}" rx="12" fill="rgba(255,255,255,.08)" stroke="${white}" stroke-width="2"/><rect x="128" y="${250-bar(tr.sand)}" width="105" height="${bar(tr.sand)}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2"/><rect x="256" y="${250-bar(tr.gravel)}" width="105" height="${bar(tr.gravel)}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2"/><rect x="384" y="120" width="105" height="130" rx="12" fill="rgba(70,160,255,.1)" stroke="${stroke}" stroke-width="2"/><text x="52" y="285" text-anchor="middle" fill="${white}" font-size="17">Cimento</text><text x="180" y="285" text-anchor="middle" fill="${white}" font-size="17">Areia</text><text x="308" y="285" text-anchor="middle" fill="${white}" font-size="17">Brita</text><text x="436" y="285" text-anchor="middle" fill="${white}" font-size="17">Água</text><text x="52" y="${240-bar(tr.cement)}" text-anchor="middle" fill="${stroke}" font-size="19" font-weight="800">${format(tr.cement, tr.cement%1?1:0)}</text><text x="180" y="${240-bar(tr.sand)}" text-anchor="middle" fill="${stroke}" font-size="19" font-weight="800">${format(tr.sand, tr.sand%1?1:0)}</text><text x="308" y="${240-bar(tr.gravel)}" text-anchor="middle" fill="${stroke}" font-size="19" font-weight="800">${format(tr.gravel, tr.gravel%1?1:0)}</text></g><text x="320" y="55" text-anchor="middle" fill="${muted}" font-size="${fs}">${tr.label}</text>${title('Proporção visual dos insumos do concreto')}`);
      }
      case 'wood': case 'cabinet': case 'drawer': {
        return svg(`<path d="M145 120 L440 120 L510 170 L215 170 Z" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><path d="M145 120 L145 292 L215 342 L215 170" fill="rgba(52,190,255,.08)" stroke="${stroke}" stroke-width="3"/><path d="M215 170 L510 170 L510 342 L215 342 Z" fill="rgba(52,190,255,.12)" stroke="${stroke}" stroke-width="3"/><line x1="215" y1="225" x2="510" y2="225" stroke="${stroke}" opacity=".55"/><line x1="215" y1="280" x2="510" y2="280" stroke="${stroke}" opacity=".55"/>${dim(215,372,510,372,calc.template==='wood'?meter(f('length',3)):`${format(f('width',2.4))} ${calc.template==='drawer'?'cm':'m'}`,360,402)}${title(calc.template==='cabinet'?'Armário e consumo de chapas':calc.template==='drawer'?'Gaveta — dimensões externas e internas':'Peça de madeira serrada')}`);
      }
      case 'rebar': case 'mesh': case 'fasteners': {
        let lines=''; for(let r=0;r<8;r++) lines+=`<line x1="100" y1="${90+r*34}" x2="535" y2="${90+r*34}" stroke="${stroke}" stroke-width="2"/>`; for(let c=0;c<12;c++) lines+=`<line x1="${100+c*39}" y1="90" x2="${100+c*39}" y2="328" stroke="${stroke}" stroke-width="2"/>`;
        return svg(`${lines}${dim(100,365,535,365,meter(f('length',f('areaLength',6))),318,397)}<text x="320" y="65" text-anchor="middle" fill="${muted}" font-size="${fs}">${calc.template==='fasteners'?'Pontos de fixação e espaçamento':'Malha e distribuição das armaduras'}</text>`);
      }
      case 'drywall': case 'paint': case 'wall': case 'wallpaper': case 'fence': {
        const length=f('length',f('width',10)), height=f('height',5), area=f('area',length*height);
        return svg(`<rect x="105" y="95" width="430" height="220" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><rect x="165" y="180" width="85" height="135" fill="#0b1423" stroke="${white}" stroke-width="3"/><rect x="350" y="145" width="110" height="76" fill="#0b1423" stroke="${white}" stroke-width="3"/><line x1="405" y1="145" x2="405" y2="221" stroke="${white}"/><line x1="350" y1="183" x2="460" y2="183" stroke="${white}"/>${calc.template==='drywall'?Array.from({length:6},(_,i)=>`<line x1="${120+i*70}" y1="95" x2="${120+i*70}" y2="315" stroke="${stroke}" opacity=".32"/>`).join(''):''}${dim(105,350,535,350,meter(length),320,382)}${dim(70,95,70,315,meter(height),38,210)}<text x="320" y="75" text-anchor="middle" fill="${muted}" font-size="${fs}">Área considerada: ${format(area)} m²</text>${title(calc.template==='paint'?'Superfície, vãos e aplicação de tinta':calc.template==='drywall'?'Modulação das chapas e montantes':'Parede, vãos e revestimento')}`);
      }
      case 'area': {
        return svg(`<path d="M115 290 L190 95 L370 70 L525 180 L470 330 L260 345 Z" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="4"/><circle cx="115" cy="290" r="6" fill="${white}"/><circle cx="190" cy="95" r="6" fill="${white}"/><circle cx="370" cy="70" r="6" fill="${white}"/><circle cx="525" cy="180" r="6" fill="${white}"/><circle cx="470" cy="330" r="6" fill="${white}"/><circle cx="260" cy="345" r="6" fill="${white}"/>${title('Polígono aproximado para área do terreno')}`);
      }
      case 'trench': {
        const depth=f('depth',1.5), length=f('length',30), bottom=f('bottomWidth',f('width',.8));
        return svg(`<path d="M115 105 L525 105 L445 300 L195 300 Z" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/>${dim(195,335,445,335,meter(bottom),320,367)}${dim(80,105,80,300,meter(depth),44,210)}<text x="320" y="76" text-anchor="middle" fill="${muted}" font-size="${fs}">Extensão da vala: ${meter(length)}</text>${title('Seção transversal e extensão da escavação')}`);
      }
      case 'well': case 'pool': {
        if(calc.template==='well') return svg(`<ellipse cx="320" cy="100" rx="145" ry="45" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><line x1="175" y1="100" x2="175" y2="310" stroke="${stroke}" stroke-width="3"/><line x1="465" y1="100" x2="465" y2="310" stroke="${stroke}" stroke-width="3"/><ellipse cx="320" cy="310" rx="145" ry="45" fill="none" stroke="${stroke}" stroke-width="3"/>${dim(175,365,465,365,meter(f('diameter',1.2)),320,397)}${dim(130,100,130,310,meter(f('depth',4)),93,210)}${title('Poço cilíndrico — diâmetro e profundidade')}`);
        return svg(`<path d="M125 135 L430 135 L520 195 L215 195 Z" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><path d="M215 195 L520 195 L520 320 L215 320 Z" fill="rgba(52,190,255,.20)" stroke="${stroke}" stroke-width="3"/><path d="M125 135 L215 195 L215 320 L125 260 Z" fill="rgba(52,190,255,.08)" stroke="${stroke}" stroke-width="3"/>${dim(215,355,520,355,meter(f('length',8)),368,387)}${dim(535,195,535,320,meter(f('depth',1.5)),575,265)}${title('Piscina retangular — volume e revestimento')}`);
      }
      case 'pipe': {
        return svg(`<ellipse cx="165" cy="210" rx="62" ry="85" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><ellipse cx="470" cy="210" rx="62" ry="85" fill="none" stroke="${stroke}" stroke-width="3" stroke-dasharray="8 8"/><line x1="165" y1="125" x2="470" y2="125" stroke="${stroke}" stroke-width="3"/><line x1="165" y1="295" x2="470" y2="295" stroke="${stroke}" stroke-width="3"/>${dim(165,335,470,335,meter(f('length',10)),318,367)}${dim(85,125,85,295,`${format(f('diameter',100),0)} mm`,48,215)}${title('Tubulação — comprimento e diâmetro interno')}`);
      }
      case 'tankCylinder': {
        const d=f('diameter',2), h=f('length',2.5), level=f('liquidLevel', calc.config.horizontal ? d/2 : h*.75);
        if (calc.config.horizontal) {
          const levelY = 305 - (clamp(level,0,d)/Math.max(d,.01))*205;
          return svg(`<ellipse cx="165" cy="205" rx="55" ry="105" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><ellipse cx="475" cy="205" rx="55" ry="105" fill="none" stroke="${stroke}" stroke-width="3" stroke-dasharray="8 8"/><line x1="165" y1="100" x2="475" y2="100" stroke="${stroke}" stroke-width="3"/><line x1="165" y1="310" x2="475" y2="310" stroke="${stroke}" stroke-width="3"/><path d="M165 ${levelY} C255 ${levelY+18} 385 ${levelY+18} 475 ${levelY}" fill="none" stroke="#64d8ff" stroke-width="4"/><path d="M165 ${levelY} C255 ${levelY+18} 385 ${levelY+18} 475 ${levelY} L475 310 C385 330 255 330 165 310 Z" fill="rgba(52,190,255,.18)"/>${dim(165,350,475,350,meter(h),320,382)}${dim(90,100,90,310,meter(d),55,210)}${dim(555,310,555,levelY,meter(clamp(level,0,d)),595,(310+levelY)/2)}${title('Tanque horizontal — nível em metros e segmento circular')}`);
        }
        return svg(`<ellipse cx="320" cy="88" rx="135" ry="34" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><rect x="185" y="${305-(clamp(level,0,h)/Math.max(h,.01))*217}" width="270" height="${(clamp(level,0,h)/Math.max(h,.01))*217}" fill="rgba(52,190,255,.18)"/><ellipse cx="320" cy="305" rx="135" ry="34" fill="none" stroke="${stroke}" stroke-width="3" stroke-dasharray="8 8"/><line x1="185" y1="88" x2="185" y2="305" stroke="${stroke}" stroke-width="3"/><line x1="455" y1="88" x2="455" y2="305" stroke="${stroke}" stroke-width="3"/>${dim(145,88,145,305,meter(h),105,205)}${dim(185,360,455,360,meter(d),320,392)}${dim(515,305,515,305-(clamp(level,0,h)/Math.max(h,.01))*217,meter(clamp(level,0,h)),555,205)}${title('Tanque vertical — nível real do líquido')}`);
      }
      case 'tankRect': {
        return svg(`<path d="M120 140 L420 140 L520 205 L220 205 Z" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><path d="M220 205 L520 205 L520 330 L220 330 Z" fill="rgba(52,190,255,.20)" stroke="${stroke}" stroke-width="3"/><path d="M120 140 L220 205 L220 330 L120 265 Z" fill="rgba(52,190,255,.08)" stroke="${stroke}" stroke-width="3"/>${dim(220,365,520,365,meter(f('length',4)),370,397)}${dim(535,205,535,330,meter(f('height',2)),575,275)}${title('Reservatório prismático — comprimento, largura e altura')}`);
      }
      case 'truncated': case 'truncatedCone': case 'gravel': {
        if(calc.template==='truncatedCone' || calc.template==='gravel') return svg(`<ellipse cx="320" cy="105" rx="90" ry="25" fill="${fill}" stroke="${stroke}" stroke-width="3"/><ellipse cx="320" cy="315" rx="170" ry="46" fill="none" stroke="${stroke}" stroke-width="3"/><line x1="230" y1="105" x2="150" y2="315" stroke="${stroke}" stroke-width="3"/><line x1="410" y1="105" x2="490" y2="315" stroke="${stroke}" stroke-width="3"/>${dim(110,105,110,315,meter(f('height',2)),70,210)}${title(calc.template==='gravel'?'Pilha cônica de agregado':'Tronco de cone e geratriz')}`);
        return svg(`<path d="M240 100 L400 100 L505 305 L135 305 Z" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><line x1="240" y1="100" x2="135" y2="305" stroke="${white}" stroke-dasharray="7 7"/>${dim(135,345,505,345,meter(f('baseA',3)),320,377)}${dim(90,100,90,305,meter(f('height',2)),52,210)}${title('Tronco de pirâmide — bases e altura')}`);
      }
      case 'ventilation': {
        let arrows=''; for(let i=0;i<4;i++) arrows+=`<path d="M${150+i*100} 300 C${180+i*100} 250 ${180+i*100} 170 ${150+i*100} 120" fill="none" stroke="${stroke}" stroke-width="4" marker-end="url(#a-${calc.id})"/>`;
        return svg(`<rect x="105" y="85" width="430" height="250" fill="url(#f-${calc.id})" stroke="${white}" stroke-width="3"/>${arrows}<rect x="255" y="65" width="130" height="28" rx="7" fill="#0b1423" stroke="${stroke}" stroke-width="2"/><text x="320" y="55" text-anchor="middle" fill="${muted}" font-size="${fs}">${format(f('changes',6),1)} renovações/h</text>${title('Fluxo e renovação de ar no ambiente')}`);
      }
      case 'waterMix': {
        return svg(`<rect x="105" y="85" width="145" height="175" rx="18" fill="rgba(255,90,65,.13)" stroke="#ff765f" stroke-width="3"/><rect x="390" y="85" width="145" height="175" rx="18" fill="rgba(52,190,255,.13)" stroke="${stroke}" stroke-width="3"/><path d="M177 260 C177 330 320 320 320 355" fill="none" stroke="#ff765f" stroke-width="4" marker-end="url(#a-${calc.id})"/><path d="M462 260 C462 330 320 320 320 355" fill="none" stroke="${stroke}" stroke-width="4" marker-end="url(#a-${calc.id})"/><text x="177" y="150" text-anchor="middle" fill="${white}" font-size="22">${format(f('hotTemp',80),0)} °C</text><text x="462" y="150" text-anchor="middle" fill="${white}" font-size="22">${format(f('coldTemp',20),0)} °C</text>${title('Balanço térmico da mistura de água')}`);
      }
      case 'greenhouse': {
        return svg(`<path d="M110 300 L110 170 L320 70 L530 170 L530 300 Z" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><line x1="320" y1="70" x2="320" y2="300" stroke="${white}" stroke-width="2" stroke-dasharray="7 7"/>${dim(110,345,530,345,meter(f('width',6)),320,377)}${dim(75,170,75,300,meter(f('wallHeight',2)),40,240)}${title('Estufa — cobertura, paredes e volume interno')}`);
      }
      case 'clamp': {
        return svg(`<path d="M190 90 L190 270 Q190 335 255 335 L385 335 Q450 335 450 270 L450 90" fill="none" stroke="${stroke}" stroke-width="18" stroke-linecap="round"/>${dim(190,365,450,365,`${format(f('insideWidth',100),0)} mm`,320,397)}${dim(150,90,150,270,`${format(f('leg',180),0)} mm`,105,185)}${title('Grampo em U — largura, pernas e desenvolvimento')}`);
      }
      case 'lighting': {
        let lights=''; for(let r=0;r<3;r++)for(let c=0;c<4;c++)lights+=`<circle cx="${190+c*85}" cy="${135+r*70}" r="18" fill="${fill}" stroke="${stroke}" stroke-width="3"/><path d="M${190+c*85} ${160+r*70} l-10 18 M${190+c*85} ${160+r*70} l10 18" stroke="${stroke}"/>`;
        return svg(`<rect x="120" y="80" width="400" height="275" fill="none" stroke="${white}" stroke-width="3"/>${lights}<text x="320" y="55" text-anchor="middle" fill="${muted}" font-size="${fs}">${format(f('lux',300),0)} lux desejados</text>${title('Distribuição preliminar das luminárias')}`);
      }
      case 'loan': {
        return svg(`<line x1="100" y1="330" x2="540" y2="330" stroke="${white}" stroke-width="2"/><line x1="100" y1="330" x2="100" y2="70" stroke="${white}" stroke-width="2"/><path d="M110 280 C200 250 250 220 320 175 C400 125 460 110 530 85" fill="none" stroke="${stroke}" stroke-width="5"/><g fill="${stroke}"><circle cx="110" cy="280" r="7"/><circle cx="320" cy="175" r="7"/><circle cx="530" cy="85" r="7"/></g><text x="320" y="370" text-anchor="middle" fill="${muted}" font-size="${fs}">${format(f('months',60),0)} meses</text>${title('Evolução simplificada do financiamento')}`);
      }
      case 'machineHourlyCost': case 'fuelCost': case 'equipmentDepreciation': {
        const bars = [0.78,0.58,0.42,0.68].map((h,i)=>`<rect x="${150+i*85}" y="${310-h*190}" width="48" height="${h*190}" rx="9" fill="${i===0?'rgba(52,190,255,.25)':'rgba(52,190,255,.12)'}" stroke="${stroke}" stroke-width="2"/>`).join('');
        return svg(`${bars}<line x1="115" y1="310" x2="525" y2="310" stroke="${white}" stroke-width="2"/><path d="M110 105 h110 l35 45 h105 l45 60 h70 v55 h-35 a35 35 0 0 0-70 0 h-160 a35 35 0 0 0-70 0 h-30 z" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3" opacity=".55"/><circle cx="175" cy="265" r="28" fill="#0b1423" stroke="${white}" stroke-width="3"/><circle cx="405" cy="265" r="28" fill="#0b1423" stroke="${white}" stroke-width="3"/>${title('Custos horários, combustível e propriedade do equipamento')}`);
      }
      case 'machineProduction': case 'fleetBalance': case 'truckHaulage': case 'compactionProduction': case 'concretePump': case 'plantProduction': {
        return svg(`<path d="M105 270 h145 l40-70 h120 l50 70 h75 v45 h-430 z" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><circle cx="175" cy="315" r="28" fill="#0b1423" stroke="${white}" stroke-width="3"/><circle cx="445" cy="315" r="28" fill="#0b1423" stroke="${white}" stroke-width="3"/><path d="M115 130 C210 75 330 75 495 130" fill="none" stroke="${stroke}" stroke-width="4" marker-end="url(#a-${calc.id})"/><text x="320" y="95" text-anchor="middle" fill="${white}" font-size="${fs}">ciclo · produção · frota</text><line x1="120" y1="365" x2="520" y2="365" stroke="${white}" stroke-dasharray="8 8"/>${title('Produção de equipamentos, ciclos e frota de obra')}`);
      }
      case 'laborCrewCost': case 'crewProductivity': case 'bdi': case 'unitComposition': case 'mobilization': case 'dailyOverhead': case 'materialLoss': case 'scheduleFinance': {
        return svg(`<rect x="105" y="90" width="430" height="250" rx="18" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><line x1="145" y1="285" x2="495" y2="285" stroke="${white}"/><rect x="165" y="215" width="50" height="70" rx="8" fill="rgba(52,190,255,.24)" stroke="${stroke}"/><rect x="245" y="165" width="50" height="120" rx="8" fill="rgba(52,190,255,.18)" stroke="${stroke}"/><rect x="325" y="125" width="50" height="160" rx="8" fill="rgba(52,190,255,.12)" stroke="${stroke}"/><rect x="405" y="190" width="50" height="95" rx="8" fill="rgba(247,201,72,.18)" stroke="#f7c948"/><text x="320" y="70" text-anchor="middle" fill="${muted}" font-size="${fs}">custos · produção · orçamento</text>${title('Composição de custos, equipe e planejamento financeiro')}`);
      }

      case 'professionalFormula': {
        const family = calc.config.diagram || calc.category;
        const color = family === 'safety' ? '#ff9b54' : family === 'hydraulic' ? '#38d7ff' : family === 'electric' ? '#f7d24b' : family === 'mechanical' ? '#9aa7ff' : family === 'industrial' ? '#74e29a' : '#d88cff';
        const label = family === 'electric' ? 'carga · cabo · proteção' : family === 'hydraulic' ? 'vazão · pressão · perda' : family === 'mechanical' ? 'força · potência · ciclo' : family === 'safety' ? 'risco · exposição · controle' : family === 'industrial' ? 'produção · disponibilidade · estoque' : 'prazo · custo · recursos';
        return svg(`<rect x="82" y="82" width="476" height="246" rx="22" fill="url(#f-${calc.id})" stroke="${color}" stroke-width="3"/>
          <circle cx="176" cy="205" r="56" fill="#0b1423" stroke="${color}" stroke-width="4"/>
          <rect x="282" y="136" width="178" height="34" rx="8" fill="rgba(255,255,255,.06)" stroke="${white}" opacity=".85"/>
          <rect x="282" y="195" width="226" height="34" rx="8" fill="rgba(255,255,255,.06)" stroke="${white}" opacity=".85"/>
          <rect x="282" y="254" width="138" height="34" rx="8" fill="rgba(255,255,255,.06)" stroke="${white}" opacity=".85"/>
          <path d="M232 205 C270 120 378 120 468 136" fill="none" stroke="${color}" stroke-width="4" marker-end="url(#a-${calc.id})"/>
          <path d="M232 205 C282 278 384 300 506 258" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="8 8"/>
          <text x="176" y="214" text-anchor="middle" fill="${white}" font-size="24" font-weight="800">${calc.icon}</text>
          <text x="320" y="76" text-anchor="middle" fill="${muted}" font-size="${fs}">${label}</text>
          ${title('Diagrama técnico paramétrico da família ' + categoryName(calc.category))}`);
      }

      default:
        return svg(`<rect x="120" y="100" width="400" height="220" rx="8" fill="url(#f-${calc.id})" stroke="${stroke}" stroke-width="3"/><line x1="120" y1="320" x2="520" y2="100" stroke="${white}" stroke-width="3" stroke-dasharray="8 8"/>${title('Representação geométrica dinâmica do cálculo')}`);
    }
  }

  function previewMetrics(calc, output) {
    const pairs = safeDetails(output, 2);
    return pairs.map(([label, value]) => `<small>${label}</small><strong>${value}</strong>`).join('');
  }

  function cardMarkup(calc) {
    const output = calculateOutput(calc, initialValuesFor(calc));
    const favorite = state.favorites.has(calc.id);
    const category = categoryName(calc.category);
    return `
      <article class="calculator-card" style="--chip:${themeColor(calc)}" data-calc-id="${calc.id}" tabindex="0" role="button" aria-label="Abrir ${calc.name}">
        <div class="card-top">
          <span class="calc-icon">${calc.icon}</span>
          <button class="favorite-button ${favorite ? 'active' : ''}" data-favorite-id="${calc.id}" title="${favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}" aria-label="Favoritar">${favorite ? '★' : '☆'}</button>
        </div>
        <h3>${calc.name}</h3>
        <p>${calc.description}</p>
        <span class="category-tag" ${chipStyle(calc)}>${category}</span>
        <div class="card-preview">
          <div class="mini-diagram">${diagramSVG(calc, initialValuesFor(calc), true)}</div>
          <div class="mini-metrics">${previewMetrics(calc, output)}</div>
        </div>
        <div class="card-footer"><span></span><span class="open-link">Abrir →</span></div>
      </article>`;
  }

  function bindCardEvents(container) {
    container.querySelectorAll('.calculator-card').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('[data-favorite-id]')) return;
        openCalculator(card.dataset.calcId);
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCalculator(card.dataset.calcId); }
      });
    });
    container.querySelectorAll('[data-favorite-id]').forEach((button) => button.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleFavorite(button.dataset.favoriteId);
    }));
  }

  function updateStats() {
    $('totalCalculators').textContent = calculators.length;
    $('totalCategories').textContent = categories.length;
    $('favoriteStat').textContent = state.favorites.size;
    $('historyStat').textContent = state.history.length;
    $('favoriteCount').textContent = state.favorites.size;
    $('historyCount').textContent = state.history.length;
  }

  function renderHome() {
    updateStats();
    const featuredIds = ['paint', 'drywall', 'rebar', 'masonry-wall', 'vertical-barrel', 'concrete-mix'];
    refs.featuredGrid.innerHTML = featuredIds.map((id) => cardMarkup(calcById(id))).join('');
    bindCardEvents(refs.featuredGrid);
    refs.categoryGrid.innerHTML = categories.map((category) => {
      const count = calculators.filter((calc) => calc.category === category.id).length;
      return `<article class="category-card" tabindex="0" data-category-id="${category.id}"><span class="category-symbol">${category.icon}</span><div><h3>${categoryName(category.id)}</h3><p>${category.description}</p></div><strong>${count}</strong></article>`;
    }).join('');
    refs.categoryGrid.querySelectorAll('[data-category-id]').forEach((card) => {
      const action = () => { state.category = card.dataset.categoryId; switchView('calculators'); renderCalculators(); };
      card.addEventListener('click', action); card.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){e.preventDefault(); action();} });
    });
  }

  function renderChips() {
    refs.categoryChips.innerHTML = [`<button class="category-chip ${state.category === 'all' ? 'active' : ''}" data-category="all">Todas (${calculators.length})</button>`].concat(categories.map((category) => {
      const count = calculators.filter((calc) => calc.category === category.id).length;
      return `<button class="category-chip ${state.category === category.id ? 'active' : ''}" style="--chip:${categoryTheme[category.id] || '#33b6ff'}" data-category="${category.id}">${categoryName(category.id)} · ${count}</button>`;
    })).join('');
    refs.categoryChips.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => { state.category = button.dataset.category; renderCalculators(); }));
  }

  function filteredCalculators() {
    let list = calculators.filter((calc) => {
      const haystack = normalize(`${calc.name} ${calc.description} ${categoryName(calc.category)}`);
      return (state.category === 'all' || calc.category === state.category) && (!state.query || haystack.includes(normalize(state.query)));
    });
    if (state.sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    if (state.sort === 'category') list.sort((a, b) => categoryName(a.category).localeCompare(categoryName(b.category), 'pt-BR') || a.name.localeCompare(b.name, 'pt-BR'));
    return list;
  }

  function renderCalculators() {
    renderChips();
    const list = filteredCalculators();
    refs.calculatorGrid.innerHTML = list.map(cardMarkup).join('');
    refs.resultCount.textContent = list.length;
    refs.calculatorEmpty.classList.toggle('hidden', list.length > 0);
    bindCardEvents(refs.calculatorGrid);
    refs.mirrorSearch.value = state.query;
  }

  function renderFavorites() {
    const list = calculators.filter((calc) => state.favorites.has(calc.id));
    refs.favoritesGrid.innerHTML = list.map(cardMarkup).join('');
    refs.favoritesEmpty.classList.toggle('hidden', list.length > 0);
    bindCardEvents(refs.favoritesGrid);
    updateStats();
  }

  function renderHistory() {
    refs.historyList.innerHTML = state.history.map((entry, index) => {
      const calc = calcById(entry.calcId);
      if (!calc) return '';
      return `<article class="history-item"><div><h3>${calc.name}</h3><div class="history-meta"><span>${categoryName(calc.category)}</span><span>${entry.date}</span></div></div><div class="history-result"><small>${entry.result.label}</small><strong>${entry.result.value}</strong></div><div class="history-actions"><button data-reopen-index="${index}">Abrir</button><button data-delete-index="${index}">Excluir</button></div></article>`;
    }).join('');
    refs.historyEmpty.classList.toggle('hidden', state.history.length > 0);
    refs.historyList.querySelectorAll('[data-reopen-index]').forEach((button) => button.addEventListener('click', () => {
      const entry = state.history[Number(button.dataset.reopenIndex)];
      openCalculator(entry.calcId, entry.inputs);
    }));
    refs.historyList.querySelectorAll('[data-delete-index]').forEach((button) => button.addEventListener('click', () => {
      state.history.splice(Number(button.dataset.deleteIndex), 1); persist(); renderHistory(); updateStats();
    }));
    updateStats();
  }

  function toggleFavorite(id) {
    if (state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
    persist();
    renderHome(); renderCalculators(); renderFavorites(); updateDetailFavorite();
    showToast(state.favorites.has(id) ? 'Calculadora adicionada aos favoritos.' : 'Calculadora removida dos favoritos.');
  }

  function navIsActive(btnView, currentView) {
    if (currentView === 'calculatorDetail' && btnView === 'calculators') return true;
    if (btnView === 'favorites' && currentView === 'favorites') return true;
    if (btnView === 'history' && currentView === 'history') return true;
    if (btnView === 'about' && currentView === 'about') return true;
    return btnView === currentView;
  }

  function switchView(view) {
    state.view = view;
    document.querySelectorAll('.page').forEach((page) => page.classList.add('hidden'));
    const pageId = view === 'calculatorDetail' ? 'calculatorDetailView' : `${view}View`;
    $(pageId).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach((button) => button.classList.toggle('active', navIsActive(button.dataset.view, view)));
    refs.sidebar.classList.remove('open');
    if (view === 'calculators') renderCalculators();
    if (view === 'favorites') renderFavorites();
    if (view === 'history') renderHistory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function validateInputs(calc, values) {
    const messages = [];
    const add = (level, text, fieldName = '') => messages.push({ level, text, fieldName });
    const defs = templates[calc.template].fields(calc);
    defs.forEach((definition) => {
      if (definition.type === 'select') return;
      const value = values[definition.name];
      if (!Number.isFinite(value)) add('error', `${definition.label}: informe um valor numérico válido.`, definition.name);
      else if (value < definition.min) add('error', `${definition.label}: o valor mínimo é ${definition.min}.`, definition.name);
      else if (value === 0 && !/custo|entrada|abertura|flecha|residual|outros/i.test(definition.label)) add('warning', `${definition.label} está zerado e pode invalidar o resultado.`, definition.name);
    });
    ['waste','loss','reserve'].forEach((name) => {
      if (name in values && (values[name] < 0 || values[name] > 50)) add(values[name] > 100 ? 'error' : 'warning', `${name === 'reserve' ? 'Reserva' : 'Perda'} fora da faixa usual de 0% a 50%.`, name);
    });
    ['utilization','maintenance','fill'].forEach((name) => {
      if (name in values && (values[name] < 0 || values[name] > 100)) add('error', `O percentual informado deve ficar entre 0% e 100%.`, name);
    });
    if (calc.template === 'roof') {
      if (values.pitch < 5) add('warning', 'Inclinação muito baixa: verifique estanqueidade e o tipo de cobertura.', 'pitch');
      if (values.pitch > 60) add('warning', 'Inclinação elevada: revise fixação, acesso e segurança.', 'pitch');
    }
    if (calc.template === 'stairs') {
      const steps = Math.max(2, Math.round(values.height * 100 / Math.max(values.targetRiser, 10)));
      const riser = values.height * 100 / steps;
      const tread = values.run * 100 / Math.max(steps - 1, 1);
      const comfort = 2 * riser + tread;
      if (riser < 16 || riser > 19) add('warning', `Espelho calculado em ${format(riser,1)} cm; revise conforto e norma aplicável.`, 'targetRiser');
      if (tread < 25) add('warning', `Piso calculado em ${format(tread,1)} cm, abaixo de uma faixa confortável.`, 'run');
      if (comfort < 61 || comfort > 64) add('warning', `Relação 2E + P = ${format(comfort,1)} cm; a geometria deve ser revisada.`, 'run');
    }
    if (calc.template === 'ring' && values.outer <= values.inner) add('error', 'O diâmetro externo deve ser maior que o diâmetro interno.', 'outer');
    if (calc.template === 'paint' && values.coverage <= 0) add('error', 'O rendimento por litro deve ser maior que zero.', 'coverage');
    if (calc.template === 'tankCylinder' && values.diameter <= 0) add('error', 'O diâmetro deve ser maior que zero.', 'diameter');
    if (calc.template === 'tankCylinder' && values.fillMode === 'level') {
      const maxLevel = calc.config.horizontal ? values.diameter : values.length;
      if (values.liquidLevel > maxLevel) add('error', `O nível do líquido não pode ser maior que ${format(maxLevel)} m.`, 'liquidLevel');
    }
    if (calc.template === 'concreteMix' && values.traceType === 'custom' && (values.cementPart <= 0 || values.sandPart < 0 || values.gravelPart < 0)) add('error', 'No traço personalizado, informe partes válidas para cimento, areia e brita.', 'cementPart');
    if (calc.template === 'loan' && values.downPayment > values.principal) add('warning', 'A entrada é maior que o valor do projeto; o saldo financiado será zero.', 'downPayment');
    return messages;
  }

  function applyValidation(messages) {
    refs.form.querySelectorAll('.form-field').forEach((field) => field.classList.remove('has-error','has-warning'));
    messages.forEach((message) => {
      if (!message.fieldName) return;
      const input = refs.form.querySelector(`[name="${message.fieldName}"]`);
      input?.closest('.form-field')?.classList.add(message.level === 'error' ? 'has-error' : 'has-warning');
    });
    if (!messages.length) {
      refs.validationSummary.classList.add('hidden');
      refs.validationSummary.innerHTML = '';
      return;
    }
    const errors = messages.filter((m) => m.level === 'error').length;
    refs.validationSummary.classList.remove('hidden');
    refs.validationSummary.classList.toggle('has-errors', errors > 0);
    refs.validationSummary.innerHTML = `<strong>${errors ? 'Revise os dados informados' : 'Verificações recomendadas'}</strong>${messages.map((m) => `<div class="validation-line ${m.level}"><span>${m.level === 'error' ? '×' : '!'}</span><p>${m.text}</p></div>`).join('')}`;
  }

  function technicalObservations(calc, values, output, validation) {
    const notes = [output.note];
    if (validation.some((m) => m.level === 'warning')) notes.push('Existem parâmetros fora das faixas usuais; revise as marcações exibidas no formulário antes de executar ou comprar materiais.');
    if (calc.category === 'concrete') notes.push('Concreto, armaduras, fundações e lajes precisam ser dimensionados por profissional habilitado, considerando cargas, solo, exposição e normas aplicáveis.');
    if (calc.category === 'roofs') notes.push('Confira vento, tipo de telha, inclinação mínima do fabricante, sobreposições, fixação e estrutura de apoio.');
    if (calc.category.includes('stairs')) notes.push('Verifique circulação, altura livre, largura útil, guarda-corpo, corrimão, piso e espelho conforme o uso da edificação.');
    if (calc.template === 'paint' || calc.template === 'tile' || calc.template === 'wallpaper') notes.push('Considere condições da superfície, recortes, paginação, absorção, lote e rendimento real informado pelo fabricante.');
    if (calc.category === 'volumes') notes.push('Volumes geométricos não substituem verificação de nível útil, folga operacional, espessura, acessórios, dilatação e capacidade estrutural.');
    if (['electrical','hydraulics','mechanical','safety','industrial','management'].includes(calc.category)) notes.push('Cálculo profissional preliminar para planejamento e orçamento. Deve ser validado por responsável técnico, normas aplicáveis, dados de fabricante e condições reais de campo.');
    return [...new Set(notes.filter(Boolean))];
  }

  function templateLabel(calc) {
    if (calc.template === 'tankCylinder') return 'GEOMETRIA';
    if (calc.template === 'paint') return 'DIMENSÕES';
    if (calc.template === 'wall') return 'ALVENARIA';
    return 'DADOS DE ENTRADA';
  }

  function buildField(definition, value) {
    if (definition.type === 'select') {
      const options = definition.options.map((option) => `<option value="${option.value}" ${String(option.value) === String(value) ? 'selected' : ''}>${option.label}</option>`).join('');
      return `<label class="form-field" data-field="${definition.name}"><span class="field-label">${definition.label}</span><div class="input-shell select-shell"><select name="${definition.name}" aria-label="${definition.label}">${options}</select></div><small class="field-help">${definition.help || 'Selecione uma opção para atualizar o cálculo.'}</small></label>`;
    }
    return `<label class="form-field" data-field="${definition.name}"><span class="field-label">${definition.label}</span><div class="input-shell"><input type="number" step="any" min="${definition.min}" name="${definition.name}" value="${value}" aria-label="${definition.label}"><span class="input-unit">${definition.unit}</span></div><small class="field-help">${definition.help || 'Preencha o valor para atualizar diagrama e resultado.'}</small></label>`;
  }

  function updateDetailFavorite() {
    if (!state.activeCalculator) return;
    const favorite = state.favorites.has(state.activeCalculator.id);
    refs.detailFavoriteButton.textContent = favorite ? '★' : '☆';
  }

  function updatePrintMetadata(calc = state.activeCalculator) {
    if (!calc) return;
    const now = dateTime();
    if (refs.printMetaDate) refs.printMetaDate.textContent = now;
    if (refs.printIssuedAt) refs.printIssuedAt.textContent = now;
    if (refs.printMetaTitle) refs.printMetaTitle.textContent = `RBX Calcula — ${calc.name} | RBX Solutions`;
    if (refs.printCalcName) refs.printCalcName.textContent = calc.name;
    if (refs.printCalcCategory) refs.printCalcCategory.textContent = categoryName(calc.category).toUpperCase();
    if (refs.printCalcDescription) refs.printCalcDescription.textContent = calc.description;
    if (refs.printBrandCalcName) refs.printBrandCalcName.textContent = calc.name;
    if (refs.printBrandCalcCategory) refs.printBrandCalcCategory.textContent = categoryName(calc.category);
    if (refs.printFooterUrl) refs.printFooterUrl.textContent = location.href;
    if (refs.printSummaryIcon) refs.printSummaryIcon.textContent = calc.icon || '◌';
  }

  function memorySteps(calc, values, output) {
    const v = values;
    const strong = (label, value) => `<strong>${label}: ${value}</strong>`;
    switch (calc.template) {
      case 'professionalFormula':
        return [`Modelo técnico aplicado: ${calc.config.kind}.`, ...((output.details || []).slice(0,4).map(([label,value]) => `${label} = ${value}`)), strong(output.label, output.value)];
      case 'paint': {
        const base = v.area * v.coats / Math.max(v.coverage, .0001);
        const loss = base * v.waste / 100;
        return [`Área equivalente = ${format(v.area)} × ${format(v.coats,0)} demãos = ${format(v.area*v.coats)} m²·demão`,`Consumo sem perda = ${format(v.area*v.coats)} ÷ ${format(v.coverage)} = ${format(base)} L`,`Perda = ${format(base)} × ${format(v.waste,0)}% = ${format(loss)} L`,strong('Consumo final',output.value)];
      }
      case 'roof': {
        const rad=v.pitch*Math.PI/180, plan=(v.length+2*v.overhang)*(v.width+2*v.overhang), area=plan/Math.max(Math.cos(rad),.25)*(calc.config.factor||1);
        return [`Área projetada = (${format(v.length)} + 2 × ${format(v.overhang)}) × (${format(v.width)} + 2 × ${format(v.overhang)}) = ${format(plan)} m²`,`Fator da inclinação = 1 ÷ cos(${format(v.pitch,0)}°) = ${format(1/Math.max(Math.cos(rad),.25),3)}`,`Área inclinada = ${format(plan)} × fator geométrico = ${format(area)} m²`,`Perdas = ${format(area)} × ${format(v.waste,0)}% = ${format(area*v.waste/100)} m²`,strong(output.label,output.value)];
      }
      case 'stairs': {
        const steps=Math.max(2,Math.round(v.height*100/Math.max(v.targetRiser,10))), riser=v.height*100/steps, tread=v.run*100/Math.max(steps-1,1), comfort=2*riser+tread;
        return [`Número de espelhos = arred(${format(v.height*100,0)} ÷ ${format(v.targetRiser,1)}) = ${steps}`,`Espelho real = ${format(v.height*100,0)} ÷ ${steps} = ${format(riser,1)} cm`,`Piso = ${format(v.run*100,0)} ÷ ${steps-1} = ${format(tread,1)} cm`,`Verificação de conforto: 2E + P = 2 × ${format(riser,1)} + ${format(tread,1)} = ${format(comfort,1)} cm`,strong(output.label,output.value)];
      }
      case 'stripFoundation': {
        const volume=v.length*v.width*v.height, final=volume*(1+v.waste/100);
        return [`V = comprimento × largura × altura`,`V = ${format(v.length)} × ${format(v.width)} × ${format(v.height)} = ${format(volume)} m³`,`Com perdas = ${format(volume)} × (1 + ${format(v.waste,0)}%) = ${format(final)} m³`,`Aço estimado = ${format(final)} × ${format(v.rebarRate,0)} = ${format(final*v.rebarRate,0)} kg`,strong(output.label,output.value)];
      }
      case 'pileFoundation': {
        const r=v.diameter/200, each=Math.PI*r*r*v.depth, total=each*v.count;
        return [`Raio = ${format(v.diameter,0)} cm ÷ 200 = ${format(r,3)} m`,`Volume unitário = π × ${format(r,3)}² × ${format(v.depth)} = ${format(each,3)} m³`,`Volume total = ${format(each,3)} × ${format(v.count,0)} = ${format(total)} m³`,`Perdas = ${format(total)} × (1 + ${format(v.waste,0)}%)`,strong(output.label,output.value)];
      }
      case 'slab': {
        const tm=calc.config.thin?v.thickness/1000:v.thickness/100, area=v.length*v.width, vol=area*tm;
        return [`Área = ${format(v.length)} × ${format(v.width)} = ${format(area)} m²`,`Espessura convertida = ${format(tm,3)} m`,`Volume = ${format(area)} × ${format(tm,3)} = ${format(vol,3)} m³`,`Volume com perdas = ${format(vol,3)} × (1 + ${format(v.waste,0)}%)`,strong(output.label,output.value)];
      }
      case 'ring': {
        const each=Math.PI*(v.outer**2-v.inner**2)/4*v.height;
        return [`Área anular = π × (D² − d²) ÷ 4`,`Área anular = π × (${format(v.outer)}² − ${format(v.inner)}²) ÷ 4`,`Volume unitário = área anular × ${format(v.height)} = ${format(each,3)} m³`,`Volume total = ${format(each,3)} × ${format(v.count,0)}`,strong(output.label,output.value)];
      }
      case 'concreteMix': {
        const trace = concreteTrace(v);
        const total = trace.cement + trace.sand + trace.gravel;
        return [`Traço selecionado = ${trace.label}`,`Partes totais = ${format(trace.cement)} + ${format(trace.sand)} + ${format(trace.gravel)} = ${format(total)}`,`Volume seco = volume com perdas × fator seco`,`Cimento, areia e brita = volume seco × parte ÷ partes totais`,`Água = cimento (kg) × relação a/c`,strong(output.label,output.value)];
      }
      case 'rebar': return [`Comprimento total = quantidade × comprimento unitário`,`Peso linear aproximado = Ø² ÷ 162 kg/m`,`Peso total = comprimento total × peso linear`,strong(output.label,output.value)];
      case 'mesh': return [`Número de linhas = dimensão ÷ espaçamento + 1`,`Comprimento total = linhas longitudinais + transversais`,`Peso = comprimento × Ø² ÷ 162`,strong(output.label,output.value)];
      case 'tile': return [`Área líquida = comprimento × largura`,`Área com perdas = área × (1 + perdas)`,`Quantidade = área com perdas ÷ área útil da peça`,strong(output.label,output.value)];
      case 'drywall': return [`Área da parede = comprimento × altura − aberturas`,`Chapas = teto(área × faces × perdas ÷ área da chapa)`,`Perfis e fixadores = taxas unitárias × área`,strong(output.label,output.value)];
      case 'wall': return [`Área líquida = área bruta − portas − janelas`,`Blocos = área líquida ÷ área modular da peça`,`Argamassa = área líquida × consumo unitário`,strong(output.label,output.value)];
      case 'trench': return [`Área da seção = (largura de topo + largura de fundo) ÷ 2 × profundidade`,`Volume geométrico = área da seção × comprimento`,`Volume transportado = volume × fator de empolamento`,strong(output.label,output.value)];
      case 'pool': return [`Volume = comprimento × largura × profundidade média`,`Capacidade = volume × 1.000 L/m³`,`Revestimento = fundo + paredes`,strong(output.label,output.value)];
      case 'pipe': return [`Área interna = π × (d/2)²`,`Volume = área interna × comprimento`,`Capacidade = volume × 1.000 L/m³`,strong(output.label,output.value)];
      case 'tankCylinder': {
        const d=v.diameter||2, r=d/2, length=v.length||2.5;
        if (calc.config.horizontal && v.fillMode === 'level') return [`Tanque horizontal por nível real`,`Área do segmento circular = r² × acos((r-h)/r) − (r-h) × √(2rh−h²)`,`Volume = área do segmento × comprimento`,`Capacidade total = π × ${format(r)}² × ${format(length)}`,strong(output.label,output.value)];
        if (v.fillMode === 'level') return [`Tanque vertical por altura real`,`Área da base = π × ${format(r)}²`,`Volume = área da base × nível do líquido (${format(v.liquidLevel)} m)`,strong(output.label,output.value)];
        return [`Capacidade total = π × ${format(r)}² × ${format(length)}`,`Volume = capacidade total × ${format(v.fill,1)}%`,strong(output.label,output.value)];
      }
      case 'tankRect': return [`V = comprimento × largura × altura útil`,`Capacidade = volume × 1.000 L/m³`,`Massa do líquido = volume × densidade`,strong(output.label,output.value)];
      case 'ventilation': return [`Volume = comprimento × largura × pé-direito`,`Vazão base = volume × renovações por hora`,`Vazão de projeto = vazão base × (1 + reserva)`,strong(output.label,output.value)];
      case 'lighting': return [`Fluxo requerido = área × iluminância`,`Fluxo útil por luminária = lúmens × utilização × manutenção`,`Quantidade = teto(fluxo requerido ÷ fluxo útil)`,strong(output.label,output.value)];
      case 'loan': return [`Saldo financiado = valor do projeto − entrada`,`Parcela Price = PV × i × (1+i)ⁿ ÷ ((1+i)ⁿ − 1)`,`Juros totais = soma das parcelas − saldo financiado`,strong(output.label,output.value)];
      case 'machineHourlyCost': return [`Combustível = consumo × preço do diesel`,`Custo direto = combustível + operador + manutenção + depreciação + outros`,`Custo produtivo = custo direto ÷ utilização`,strong(output.label,output.value)];
      case 'machineProduction': return [`Ciclos por hora = 3600 ÷ tempo de ciclo`,`Produção solta = caçamba × ciclos × enchimento × eficiência`,`Produção no corte = produção solta ÷ fator de empolamento`,strong(output.label,output.value)];
      case 'truckHaulage': return [`Ciclo = ida carregado + volta vazio + carga + descarga`,`Produção = viagens por hora × capacidade × frota`,`Custo unitário = custo horário da frota ÷ produção`,strong(output.label,output.value)];
      case 'bdi': return [`BDI = ((1+AC)×(1+R)×(1+DF)×(1+L)/(1-I))-1`,`Preço = custo direto × (1+BDI)`,strong(output.label,output.value)];
      default: return [`Entradas consideradas: ${Object.entries(values).slice(0,4).map(([k,val])=>`${k}=${format(val)}`).join(' · ')}`, ...(output.details||[]).slice(0,4).map(([l,val])=>`${l}: ${val}`), strong(output.label,output.value)];
    }
  }

  function renderDetail(values) {
    const calc = state.activeCalculator;
    if (!calc) return;
    state.currentInputs = values;
    const validation = validateInputs(calc, values);
    applyValidation(validation);
    const errors = validation.filter((m) => m.level === 'error');
    if (errors.length) {
      state.lastResult = null;
      refs.resultPrimaryLabel.textContent = 'Resultado indisponível';
      refs.resultPrimaryValue.textContent = '—';
      refs.resultSecondary.innerHTML = '<div class="secondary-line"><small>Correção necessária</small><strong>Revise os campos destacados</strong></div>';
      refs.materialsTable.innerHTML = '<div class="materials-empty">Os quantitativos serão exibidos após a correção dos dados.</div>';
      refs.memoryList.innerHTML = '<div class="memory-item">A memória de cálculo foi interrompida para evitar um resultado inconsistente.</div>';
      refs.technicalNotes.innerHTML = errors.map((item) => `<div class="technical-note error"><span>×</span><p>${item.text}</p></div>`).join('');
      refs.diagram.innerHTML = diagramSVG(calc, values, false);
      refs.diagramMeta.innerHTML = '';
      refs.diagramNote.textContent = 'Revise os parâmetros destacados para liberar o cálculo.';
      return;
    }
    const output = calculateOutput(calc, values);
    state.lastResult = output;
    refs.resultPrimaryLabel.textContent = output.label;
    refs.resultPrimaryValue.textContent = output.value;
    refs.resultSecondary.innerHTML = safeDetails(output, 3).map(([label, value]) => `<div class="secondary-line"><small>${label}</small><strong>${value}</strong></div>`).join('');
    refs.materialsTable.innerHTML = `<div class="materials-row header"><div>Item</div><div>Quantidade</div><div>Un.</div><div>Tipo</div></div>` + (output.details || []).slice(0, 6).map(([label, value]) => {
      const stringValue = String(value); const match = stringValue.match(/^(.+?)\s+(m²|m³|kg|un|L|m|cm|mm|R\$.*|°)$/); const qty = match ? match[1] : stringValue; const unit = match ? match[2] : '—';
      const type = /custo|R\$/i.test(label + stringValue) ? 'Custo' : 'Quant.';
      return `<div class="materials-row"><div>${label}</div><div>${qty}</div><div>${unit}</div><div>${type}</div></div>`;
    }).join('');
    refs.memoryList.innerHTML = memorySteps(calc, values, output).map((item, index) => `<div class="memory-item"><span class="memory-step">${index+1}</span><div>${item}</div></div>`).join('');
    refs.technicalNotes.innerHTML = technicalObservations(calc, values, output, validation).map((text, index) => `<div class="technical-note ${index === 0 ? 'primary' : ''}"><span>${index === 0 ? 'i' : '✓'}</span><p>${text}</p></div>`).join('');
    refs.diagram.innerHTML = diagramSVG(calc, values, false);
    refs.diagramMeta.innerHTML = safeDetails(output, 4).map(([label, value]) => `<div class="meta-box"><small>${label}</small><strong>${value}</strong></div>`).join('');
    refs.diagramNote.textContent = output.note;
  }

  function openCalculator(id, initialValues = null) {
    const calc = calcById(id);
    if (!calc) return;
    const template = templates[calc.template];
    if (!template) return;
    state.activeCalculator = calc;
    refs.detailCategory.textContent = categoryName(calc.category).toUpperCase();
    refs.detailTitle.textContent = calc.name;
    refs.detailDescription.textContent = calc.description;
    refs.formCardTitle.textContent = templateLabel(calc);
    if (refs.detailIcon) refs.detailIcon.textContent = calc.icon || '◌';
    updatePrintMetadata(calc);
    const defaults = initialValues || initialValuesFor(calc);
    refs.form.innerHTML = template.fields(calc).map((definition) => buildField(definition, defaults[definition.name] ?? definition.value)).join('');
    updateDetailFavorite();
    switchView('calculatorDetail');
    renderDetail(currentValuesFromForm());
    refs.form.querySelectorAll('input, select').forEach((input) => input.addEventListener('input', () => {
      if (refs.autoCalcToggle.checked) renderDetail(currentValuesFromForm());
    }));
  }

  function saveCurrentCalculation() {
    if (!state.activeCalculator || !state.lastResult) return;
    state.history.unshift({
      calcId: state.activeCalculator.id,
      date: dateTime(),
      inputs: { ...state.currentInputs },
      result: { label: state.lastResult.label, value: state.lastResult.value }
    });
    state.history = state.history.slice(0, 80);
    persist(); renderHistory(); updateStats();
    showToast('Cálculo salvo no histórico local.');
  }

  function resetActive() {
    if (!state.activeCalculator) return;
    openCalculator(state.activeCalculator.id);
  }

  function exportCurrent() {
    if (!state.activeCalculator || !state.lastResult) return;
    const lines = [
      `RBX Engenharia Calc PRO v2.7.5 - ${state.activeCalculator.name}`,
      `${state.lastResult.label}: ${state.lastResult.value}`,
      '',
      ...state.lastResult.details.map(([l,v]) => `${l}: ${v}`),
      '',
      'Memória de cálculo:',
      ...memorySteps(state.activeCalculator, state.currentInputs, state.lastResult).map((l) => '- ' + l.replace(/<[^>]+>/g,''))
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${normalize(state.activeCalculator.name).replace(/\s+/g,'-')}.txt`;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  }

  function on(target, event, handler) { if (target && target.addEventListener) target.addEventListener(event, handler); }

  function bindEvents() {
    document.querySelectorAll('.nav-item').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.view)));
    document.querySelectorAll('[data-jump]').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.jump)));
    document.querySelectorAll('[data-open-featured]').forEach((button) => button.addEventListener('click', () => openCalculator(button.dataset.openFeatured)));
    on(refs.newEstimateButton, 'click', () => { switchView('calculators'); refs.search.focus(); });
    on(refs.search, 'input', () => { state.query = refs.search.value; refs.mirrorSearch.value = state.query; if (state.query && state.view !== 'calculators') switchView('calculators'); renderCalculators(); });
    on(refs.mirrorSearch, 'input', () => { state.query = refs.mirrorSearch.value; refs.search.value = state.query; renderCalculators(); });
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); refs.search.focus(); }
      if (event.key === 'Escape') refs.sidebar.classList.remove('open');
    });
    on(refs.sortSelect, 'change', () => { state.sort = refs.sortSelect.value; renderCalculators(); });
    on(refs.clearFiltersButton, 'click', () => { state.query = ''; state.category = 'all'; refs.search.value = ''; refs.mirrorSearch.value = ''; renderCalculators(); });
    on(refs.menuButton, 'click', () => refs.sidebar.classList.toggle('open'));
    on(refs.calculateButton, 'click', () => renderDetail(currentValuesFromForm()));
    on(refs.resetButton, 'click', resetActive);
    on(refs.backToCatalogButton, 'click', () => switchView('calculators'));
    on(refs.printButton, 'click', () => { updatePrintMetadata(); state.printMode = true; renderDetail(currentValuesFromForm()); setTimeout(() => window.print(), 80); });
    on(refs.exportButton, 'click', exportCurrent);
    on(refs.saveButton, 'click', saveCurrentCalculation);
    on(refs.duplicateButton, 'click', () => { if(state.activeCalculator) openCalculator(state.activeCalculator.id, { ...state.currentInputs }); showToast('Cálculo duplicado para edição.'); });
    on(refs.detailFavoriteButton, 'click', () => state.activeCalculator && toggleFavorite(state.activeCalculator.id));
    document.querySelectorAll('[data-result-tab]').forEach((button) => button.addEventListener('click', () => {
      document.querySelectorAll('[data-result-tab]').forEach((item) => item.classList.toggle('active', item === button));
      document.querySelectorAll('[data-result-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.resultPanel === button.dataset.resultTab));
    }));
    on(refs.themeButton, 'click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
    on(refs.clearHistoryButton, 'click', () => {
      if (!state.history.length) return;
      if (confirm('Deseja realmente limpar todo o histórico salvo neste dispositivo?')) { state.history = []; persist(); renderHistory(); updateStats(); showToast('Histórico removido.'); }
    });
    window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); state.deferredPrompt = event; refs.installButton.hidden = false; });
    on(refs.installButton, 'click', async () => { if (!state.deferredPrompt) return; state.deferredPrompt.prompt(); await state.deferredPrompt.userChoice; state.deferredPrompt = null; refs.installButton.hidden = true; });
    window.addEventListener('beforeprint', () => { if (state.activeCalculator) { updatePrintMetadata(); state.printMode = true; renderDetail(currentValuesFromForm()); } });
    window.addEventListener('afterprint', () => { if (state.activeCalculator) { state.printMode = false; renderDetail(currentValuesFromForm()); } });
  }

  function init() {
    setTheme(localStorage.getItem(STORAGE.theme) || 'dark');
    renderHome(); renderCalculators(); renderFavorites(); renderHistory(); bindEvents();
    if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }

  init();
})();
