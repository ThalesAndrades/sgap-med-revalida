import { User, Case, Finding, KnowledgeTopic } from '../../types';

export const initialUsers: User[] = [
  {
    id: 'user-001',
    email: 'candidato@teste.com',
    crm_provisory: '12345/P',
    name: 'Dr. Candidato Teste',
    role: 'candidate',
    created_at: new Date().toISOString(),
    last_access: new Date().toISOString(),
  }
];

export const initialCases: Case[] = [
  // 1. Cirurgia - Trauma (ATLS)
  {
    id: 'case-cir-001',
    title: 'O Motoqueiro da BR',
    specialty: 'Cirurgia Geral',
    difficulty: 'intermediate',
    description: 'Paciente masculino, 25 anos, vítima de colisão moto x anteparo fixo. Trazido pelo SAMU imobilizado. GCS 14.',
    expected_diagnosis: ['Choque Hipovolêmico Classe III', 'Trauma Abdominal Fechado', 'Instabilidade Pélvica'],
    expected_conduct: ['Protocolo ATLS (ABCDE)', 'Acesso Venoso Calibroso Bilateral', 'Cristaloide Aquecido', 'Ácido Tranexâmico', 'FAST', 'Raio-X Pelve', 'Laparotomia ou Fixação Pélvica'],
    time_limit: 10,
    is_active: true,
  },
  // 2. Pediatria - Asma
  {
    id: 'case-ped-001',
    title: 'A Criança que "Chia"',
    specialty: 'Pediatria',
    difficulty: 'basic',
    description: 'Mãe traz filho de 6 anos ao PS com "falta de ar" e tosse seca há 2 horas. Histórico de "bronquite".',
    expected_diagnosis: ['Crise Asmática Moderada/Grave', 'Exacerbação Aguda de Asma'],
    expected_conduct: ['Oxigenoterapia (se Sat < 92%)', 'Beta-2 Agonista Curta (Salbutamol) 3 ciclos', 'Corticoide Sistêmico (Prednisolona)', 'Reavaliação em 1h'],
    time_limit: 10,
    is_active: true,
  },
  // 3. Clínica Médica - IAM
  {
    id: 'case-cli-001',
    title: 'Dor no Peito no Supermercado',
    specialty: 'Clínica Médica',
    difficulty: 'intermediate',
    description: 'Homem, 58 anos, diabético e hipertenso, refere dor retroesternal opressiva há 45 min, iniciada enquanto fazia compras.',
    expected_diagnosis: ['Infarto Agudo do Miocárdio com Supradesnivelamento de ST (IAMCSST)', 'Síndrome Coronariana Aguda'],
    expected_conduct: ['MONAB (Morfina, O2, Nitrato, AAS, Beta-bloq)', 'ECG em 10 min', 'Clopidogrel (Dose ataque)', 'Trombólise ou Angioplastia Primária'],
    time_limit: 10,
    is_active: true,
  },
  // 4. Ginecologia - Sangramento
  {
    id: 'case-go-001',
    title: 'Sangramento na Gestação',
    specialty: 'Ginecologia e Obstetrícia',
    difficulty: 'advanced',
    description: 'Gestante, 34 semanas, G3P2, chega com sangramento vaginal vermelho vivo, indolor, iniciado após relação sexual.',
    expected_diagnosis: ['Placenta Prévia Total/Parcial', 'Hemorragia da 2ª Metade da Gestação'],
    expected_conduct: ['Não realizar toque vaginal', 'Estabilização hemodinâmica', 'Cardiotocografia', 'Ultrassom Obstétrico', 'Internação', 'Corticoterapia (maturidade pulmonar)'],
    time_limit: 10,
    is_active: true,
  },
   // 5. Medicina de Família - Saúde Mental
   {
    id: 'case-mfc-001',
    title: 'Tristeza Profunda',
    specialty: 'Medicina de Família',
    difficulty: 'basic',
    description: 'Mulher, 45 anos, vem à consulta de rotina queixando-se de insônia, perda de apetite e desânimo há 3 meses.',
    expected_diagnosis: ['Episódio Depressivo Maior', 'Transtorno Depressivo'],
    expected_conduct: ['Avaliação de Risco de Suicídio', 'Início de ISRS (Fluoxetina/Sertralina)', 'Encaminhamento para Psicoterapia', 'Retorno em 2 semanas'],
    time_limit: 10,
    is_active: true,
  },
  // 6. Cirurgia - Abdome Agudo
  {
    id: 'case-cir-002',
    title: 'Dor Abdominal em Fossa Ilíaca Direita',
    specialty: 'Cirurgia Geral',
    difficulty: 'basic',
    description: 'Homem, 22 anos, dor abdominal há 24h, iniciada em mesogástrio e migrou para FID. Nega comorbidades.',
    expected_diagnosis: ['Apendicite Aguda'],
    expected_conduct: ['Jejum', 'Analgesia', 'Antibioticoterapia Profilática', 'Apendicectomia'],
    time_limit: 10,
    is_active: true,
  },
  // 7. Pediatria - Reanimação Neonatal
  {
    id: 'case-ped-002',
    title: 'O Recém-Nascido Hipotônico',
    specialty: 'Pediatria',
    difficulty: 'advanced',
    description: 'RN a termo, parto vaginal, líquido amniótico meconial espesso. Nasce hipotônico e em apneia.',
    expected_diagnosis: ['Asfixia Perinatal', 'Depressão Neonatal'],
    expected_conduct: ['Clampeamento imediato do cordão', 'Mesa de reanimação (PAS)', 'VPP com máscara em ar ambiente', 'Checar FC', 'Intubação se necessário'],
    time_limit: 10,
    is_active: true,
  },
  // 8. Clínica Médica - Cetoacidose
  {
    id: 'case-cli-002',
    title: 'Torpor e Hálito Cetônico',
    specialty: 'Clínica Médica',
    difficulty: 'advanced',
    description: 'Jovem de 19 anos, DM1, trazida rebaixada. Respiração de Kussmaul e desidratação grave.',
    expected_diagnosis: ['Cetoacidose Diabética (CAD)'],
    expected_conduct: ['Hidratação vigorosa (SF 0,9%)', 'Insulina Regular em Bomba', 'Reposição de Potássio', 'Monitorização em UTI'],
    time_limit: 10,
    is_active: true,
  },
  // 9. GO - Pré-Eclâmpsia
  {
    id: 'case-go-002',
    title: 'Cefaleia e Escotomas',
    specialty: 'Ginecologia e Obstetrícia',
    difficulty: 'intermediate',
    description: 'Gestante, 38 semanas, refere cefaleia intensa e visão turva. PA 160/110 mmHg confirmada.',
    expected_diagnosis: ['Pré-Eclâmpsia Grave', 'Iminência de Eclâmpsia'],
    expected_conduct: ['Sulfato de Magnésio (Ataque + Manutenção)', 'Hidralazina EV', 'Interrupção da gestação após estabilização'],
    time_limit: 10,
    is_active: true,
  },
  // 10. MFC - Tuberculose
  {
    id: 'case-mfc-002',
    title: 'Tosse há 4 semanas',
    specialty: 'Medicina de Família',
    difficulty: 'basic',
    description: 'Homem, 50 anos, tabagista, queixa-se de tosse produtiva há 1 mês, febre vespertina e emagrecimento.',
    expected_diagnosis: ['Tuberculose Pulmonar'],
    expected_conduct: ['Solicitar Baciloscopia (TRM-TB)', 'Raio-X de Tórax', 'Sorologia HIV', 'Notificação', 'Iniciar esquema RIPE'],
    time_limit: 10,
    is_active: true,
  }
];

export const initialFindings: Finding[] = [
  // --- Case 1: Cirurgia (Trauma) ---
  {
    id: 'f-cir-1-a',
    case_id: 'case-cir-001',
    finding_type: 'physical_exam',
    description: 'Avaliação A (Vias Aéreas)',
    display_order: 1,
    is_critical: true,
    response_text: 'Vias aéreas pérvias. Paciente fala, sem estridor ou rouquidão. Colar cervical bem posicionado.',
  },
  {
    id: 'f-cir-1-b',
    case_id: 'case-cir-001',
    finding_type: 'physical_exam',
    description: 'Avaliação B (Respiração)',
    display_order: 2,
    is_critical: true,
    response_text: 'Murmúrio vesicular presente bilateralmente, sem ruídos adventícios. Expansibilidade preservada. SatO2 96% com máscara.',
  },
  {
    id: 'f-cir-1-c',
    case_id: 'case-cir-001',
    finding_type: 'physical_exam',
    description: 'Avaliação C (Circulação)',
    display_order: 3,
    is_critical: true,
    response_text: 'Pele fria e pegajosa. Pulso radial filiforme (130 bpm). PA 80/50 mmHg. Pelve instável à compressão lateral.',
  },
  {
    id: 'f-cir-1-fast',
    case_id: 'case-cir-001',
    finding_type: 'complementary_exam',
    description: 'E-FAST',
    display_order: 4,
    is_critical: true,
    response_text: 'Líquido livre em espaço de Morrison (Hepatorrenal) e Esplenorrenal. Janela pericárdica negativa.',
  },

  // --- Case 2: Pediatria (Asma) ---
  {
    id: 'f-ped-1-anamnese',
    case_id: 'case-ped-001',
    finding_type: 'anamnesis',
    description: 'História da Doença Atual',
    display_order: 1,
    is_critical: false,
    response_text: 'Mãe relata que criança estava brincando quando começou a tossir e chiar. Usou "bombinha" em casa sem melhora. Nega febre.',
  },
  {
    id: 'f-ped-1-ef',
    case_id: 'case-ped-001',
    finding_type: 'physical_exam',
    description: 'Exame Físico Respiratório',
    display_order: 2,
    is_critical: true,
    response_text: 'Taquidispneia (FR 40irpm). Tiragem subcostal presente. Sibilos expiratórios difusos à ausculta. SatO2 89% em AA.',
  },
  {
    id: 'f-ped-1-geral',
    case_id: 'case-ped-001',
    finding_type: 'physical_exam',
    description: 'Estado Geral',
    display_order: 3,
    is_critical: false,
    response_text: 'Criança consciente, porém agitada e ansiosa. Corada, hidratada, acianótica. Fala frases entrecortadas.',
  },

  // --- Case 3: Clínica (IAM) ---
  {
    id: 'f-cli-1-anamnese',
    case_id: 'case-cli-001',
    finding_type: 'anamnesis',
    description: 'Característica da Dor',
    display_order: 1,
    is_critical: true,
    response_text: 'Dor tipo aperto, intensidade 9/10, irradia para MSE. Associada a náuseas e sudorese fria.',
  },
  {
    id: 'f-cli-1-ef',
    case_id: 'case-cli-001',
    finding_type: 'physical_exam',
    description: 'Exame Físico Cardiovascular',
    display_order: 2,
    is_critical: false,
    response_text: 'RCR 2T, BNF, sem sopros. Turgência jugular patológica ausente. FC 100 bpm, PA 150/90 mmHg.',
  },
  {
    id: 'f-cli-1-ecg',
    case_id: 'case-cli-001',
    finding_type: 'complementary_exam',
    description: 'Eletrocardiograma (ECG)',
    display_order: 3,
    is_critical: true,
    response_text: 'Ritmo Sinusal. Supradesnivelamento do segmento ST de 3mm em V1, V2, V3 e V4 (Parede Anterior Extensa).',
  },

  // --- Case 4: GO (Placenta Prévia) ---
  {
    id: 'f-go-1-anamnese',
    case_id: 'case-go-001',
    finding_type: 'anamnesis',
    description: 'História Obstétrica',
    display_order: 1,
    is_critical: true,
    response_text: 'G3P2 (2 cesáreas anteriores). Pré-natal sem intercorrências até o momento. Nega dor abdominal ou contrações.',
  },
  {
    id: 'f-go-1-ef',
    case_id: 'case-go-001',
    finding_type: 'physical_exam',
    description: 'Exame Físico Obstétrico',
    display_order: 2,
    is_critical: true,
    response_text: 'AU 32cm. BCF 144bpm, rítmico. Tônus uterino normal. Especular: Sangramento vivo pelo orifício externo do colo. Toque Vaginal CONTRAINDICADO.',
  },
  {
    id: 'f-go-1-usg',
    case_id: 'case-go-001',
    finding_type: 'complementary_exam',
    description: 'Ultrassom Obstétrico',
    display_order: 3,
    is_critical: true,
    response_text: 'Feto único, vivo, cefálico. Placenta corporal posterior, cobrindo totalmente o orifício interno do colo uterino (Placenta Prévia Total).',
  },

  // --- Case 6: Cirurgia (Apendicite) ---
  {
    id: 'f-cir-2-ef',
    case_id: 'case-cir-002',
    finding_type: 'physical_exam',
    description: 'Exame Abdominal',
    display_order: 1,
    is_critical: true,
    response_text: 'Abdome plano, RHA presentes. Doloroso à palpação em FID. Blumberg positivo (Descompressão brusca dolorosa). Rovsing positivo.',
  },
  {
    id: 'f-cir-2-lab',
    case_id: 'case-cir-002',
    finding_type: 'complementary_exam',
    description: 'Hemograma',
    display_order: 2,
    is_critical: false,
    response_text: 'Leucocitose (16.000) com desvio à esquerda. PCR elevada.',
  },

  // --- Case 7: Pediatria (RN) ---
  {
    id: 'f-ped-2-apgar',
    case_id: 'case-ped-002',
    finding_type: 'physical_exam',
    description: 'Avaliação Inicial',
    display_order: 1,
    is_critical: true,
    response_text: 'RN hipotônico, não chora, cianose central. FC < 100 bpm.',
  },
  {
    id: 'f-ped-2-vpp',
    case_id: 'case-ped-002',
    finding_type: 'physical_exam',
    description: 'Resposta à VPP',
    display_order: 2,
    is_critical: true,
    response_text: 'Após 30s de VPP: FC sobe para 120 bpm, RN melhora tônus e começa a ter respiração espontânea.',
  },

  // --- Case 8: Clínica (CAD) ---
  {
    id: 'f-cli-2-ef',
    case_id: 'case-cli-002',
    finding_type: 'physical_exam',
    description: 'Exame Físico Geral',
    display_order: 1,
    is_critical: true,
    response_text: 'Torporosa (GCS 10). Mucosas secas 4+/4+. Hálito cetônico (fruta podre). Respiração rápida e profunda (Kussmaul).',
  },
  {
    id: 'f-cli-2-destro',
    case_id: 'case-cli-002',
    finding_type: 'complementary_exam',
    description: 'Glicemia Capilar (HGT)',
    display_order: 2,
    is_critical: true,
    response_text: 'HI (High) > 600 mg/dL.',
  },
  {
    id: 'f-cli-2-gaso',
    case_id: 'case-cli-002',
    finding_type: 'complementary_exam',
    description: 'Gasometria Arterial',
    display_order: 3,
    is_critical: true,
    response_text: 'pH 7.10, HCO3 8, pCO2 20. Acidose metabólica com ânion gap elevado.',
  },

  // --- Case 9: GO (DHEG) ---
  {
    id: 'f-go-2-ef',
    case_id: 'case-go-002',
    finding_type: 'physical_exam',
    description: 'Sinais Vitais e Reflexos',
    display_order: 1,
    is_critical: true,
    response_text: 'PA 160/110 mmHg. Reflexos patelares exaltados (Hiperreflexia). Clonus presente.',
  },
  {
    id: 'f-go-2-proteinuria',
    case_id: 'case-go-002',
    finding_type: 'complementary_exam',
    description: 'Proteinúria de Fita',
    display_order: 2,
    is_critical: false,
    response_text: '3+ (+++/4+).',
  },

  // --- Case 10: MFC (TB) ---
  {
    id: 'f-mfc-2-anamnese',
    case_id: 'case-mfc-002',
    finding_type: 'anamnesis',
    description: 'Interrogatório Sintomatológico',
    display_order: 1,
    is_critical: true,
    response_text: 'Tosse produtiva há 4 semanas. Sudorese noturna importante. Perda de 5kg no período. Mora com esposa e 2 filhos.',
  },
  {
    id: 'f-mfc-2-rx',
    case_id: 'case-mfc-002',
    finding_type: 'complementary_exam',
    description: 'Raio-X de Tórax',
    display_order: 2,
    is_critical: true,
    response_text: 'Infiltrado em ápice pulmonar direito com cavitação.',
  },
  {
    id: 'f-mfc-2-bacilo',
    case_id: 'case-mfc-002',
    finding_type: 'complementary_exam',
    description: 'Baciloscopia/TRM-TB',
    display_order: 3,
    is_critical: true,
    response_text: 'Detectado Mycobacterium tuberculosis. Sensível à Rifampicina.',
  }
];

export const initialTopics: KnowledgeTopic[] = [
  // --- CARDIOLOGIA ---
  {
    id: 'top-cardio-001',
    title: 'Síndrome Coronariana Aguda (SCA)',
    category: 'Cardiologia',
    tags: ['IAM', 'Angina', 'Dor Torácica', 'ECG'],
    summary: 'Manejo inicial da dor torácica na emergência.',
    content_type: 'protocol',
    content: { steps: ['Avaliação em 10 min (ECG)', 'MONAB (Morfina, O2, Nitrato, AAS, BB)', 'Definir Reperfusão (Trombólise vs Angioplastia)'] },
    references: ['Diretriz SBC 2021']
  },
  {
    id: 'top-cardio-002',
    title: 'Insuficiência Cardíaca Descompensada',
    category: 'Cardiologia',
    tags: ['IC', 'Edema Agudo', 'Furosemida'],
    summary: 'Abordagem quente-úmido vs frio-seco.',
    content_type: 'flowchart',
    content: { steps: ['Avaliar Perfusão (Quente/Frio)', 'Avaliar Congestão (Úmido/Seco)', 'Perfil B (Quente/Úmido): Diurético + Vasodilatador'] },
    references: ['Diretriz SBC IC 2018']
  },
  {
    id: 'top-cardio-003',
    title: 'Hipertensão Arterial Sistêmica',
    category: 'Cardiologia',
    tags: ['HAS', 'Crise Hipertensiva', 'Emergência'],
    summary: 'Diferenciação entre Urgência e Emergência Hipertensiva.',
    content_type: 'concept',
    content: { explanation: 'Emergência tem lesão de órgão alvo aguda (encefalopatia, IAM, EAP). Urgência não tem lesão aguda, reduzir PA em 24h.' },
    references: ['Diretriz Brasileira de Hipertensão 2020']
  },
  {
    id: 'top-cardio-004',
    title: 'Fibrilação Atrial',
    category: 'Cardiologia',
    tags: ['Arritmia', 'Anticoagulação', 'CHADS-VASC'],
    summary: 'Controle de frequência vs ritmo e prevenção de tromboembolismo.',
    content_type: 'mnemonic',
    content: { items: [{ key: 'C', value: 'Congestive heart failure' }, { key: 'H', value: 'Hypertension' }, { key: 'A', value: 'Age >= 75 (2 pts)' }] },
    references: ['ESC Guidelines 2020']
  },

  // --- PNEUMOLOGIA ---
  {
    id: 'top-pneumo-001',
    title: 'Pneumonia Adquirida na Comunidade (PAC)',
    category: 'Pneumologia',
    tags: ['Pneumonia', 'CURB-65', 'Antibiótico'],
    summary: 'Estratificação de risco e escolha de antibiótico.',
    content_type: 'protocol',
    content: { steps: ['Aplicar CURB-65', '0-1: Ambulatorial (Amoxi/Macrolídeo)', '2: Internação (Beta-lactâmico + Macrolídeo)', '3+: UTI'] },
    references: ['SBPT 2018']
  },
  {
    id: 'top-pneumo-002',
    title: 'Asma: Manejo da Crise',
    category: 'Pneumologia',
    tags: ['Asma', 'Broncoespasmo', 'Salbutamol'],
    summary: 'Tratamento da exacerbação aguda na emergência.',
    content_type: 'flowchart',
    content: { steps: ['Avaliar Gravidade (Fala, FR, Sat)', 'O2 se Sat < 92%', 'Beta-2 Curta (3 doses)', 'Corticoide Sistêmico Precoce'] },
    references: ['GINA 2023']
  },
  {
    id: 'top-pneumo-003',
    title: 'DPOC Exacerbado',
    category: 'Pneumologia',
    tags: ['DPOC', 'Enfisema', 'Tabagismo'],
    summary: 'Critérios de Anthonisen para uso de antibiótico.',
    content_type: 'concept',
    content: { explanation: 'Usar ATB se: Aumento da dispneia, aumento do volume do escarro, purulência do escarro (obrigatório).' },
    references: ['GOLD 2023']
  },
  {
    id: 'top-pneumo-004',
    title: 'Tromboembolismo Pulmonar (TEP)',
    category: 'Pneumologia',
    tags: ['TEP', 'Wells', 'D-Dímero'],
    summary: 'Diagnóstico de TEP agudo.',
    content_type: 'flowchart',
    content: { steps: ['Suspeita Clínica -> Escore de Wells', 'Improvável: D-Dímero', 'Provável: Angio-TC de Tórax'] },
    references: ['ESC Guidelines 2019']
  },

  // --- GASTROENTEROLOGIA ---
  {
    id: 'top-gastro-001',
    title: 'Hemorragia Digestiva Alta (HDA)',
    category: 'Gastroenterologia',
    tags: ['HDA', 'Melena', 'Varizes'],
    summary: 'Manejo inicial do sangramento digestivo alto.',
    content_type: 'protocol',
    content: { steps: ['Estabilização Hemodinâmica', 'IBP em bolus + bomba', 'Terlipressina (se varizes)', 'EDA nas primeiras 24h'] },
    references: ['ACG Guidelines']
  },
  {
    id: 'top-gastro-002',
    title: 'Doença do Refluxo (DRGE)',
    category: 'Gastroenterologia',
    tags: ['DRGE', 'Pirose', 'IBP'],
    summary: 'Diagnóstico e tratamento da DRGE.',
    content_type: 'concept',
    content: { explanation: 'Prova terapêutica com IBP dose plena por 4-8 semanas. EDA se sinais de alarme (disfagia, perda de peso, anemia).' },
    references: ['Federação Brasileira de Gastro']
  },

  // --- PEDIATRIA ---
  {
    id: 'top-ped-001',
    title: 'Calendário Vacinal (PNI)',
    category: 'Pediatria',
    tags: ['Vacina', 'Imunização', 'PNI'],
    summary: 'Vacinas do primeiro ano de vida.',
    content_type: 'mnemonic',
    content: { items: [{ key: '2 meses', value: '4 P (Penta, Polio, Pneumo, Piriri-Rota)' }, { key: '3 meses', value: 'Meningo C' }, { key: '4 meses', value: 'Igual a 2 meses' }] },
    references: ['Ministério da Saúde 2024']
  },
  {
    id: 'top-ped-002',
    title: 'Desidratação na Diarreia Aguda',
    category: 'Pediatria',
    tags: ['Diarreia', 'TRO', 'Hidratação'],
    summary: 'Planos A, B e C da OMS.',
    content_type: 'flowchart',
    content: { steps: ['Sem desidratação: Plano A (Casa)', 'Desidratação Leve/Mod: Plano B (TRO na UBS)', 'Grave: Plano C (Expansão EV)'] },
    references: ['MS - AIDPI']
  },
  {
    id: 'top-ped-003',
    title: 'Icterícia Neonatal',
    category: 'Pediatria',
    tags: ['Icterícia', 'Kramer', 'Fototerapia'],
    summary: 'Avaliação de risco e indicação de fototerapia.',
    content_type: 'concept',
    content: { explanation: 'Zonas de Kramer ajudam na estimativa. Icterícia < 24h é sempre patológica (investigar hemólise).' },
    references: ['SBP 2022']
  },

  // --- GINECOLOGIA E OBSTETRÍCIA ---
  {
    id: 'top-go-001',
    title: 'Rastreamento de Câncer de Colo Utero',
    category: 'Ginecologia',
    tags: ['Papanicolau', 'Preventivo', 'HPV'],
    summary: 'Diretrizes de rastreamento no Brasil.',
    content_type: 'protocol',
    content: { steps: ['Início aos 25 anos (sexualmente ativas)', 'A cada 3 anos (após 2 anuais negativos)', 'Até os 64 anos'] },
    references: ['INCA']
  },
  {
    id: 'top-go-002',
    title: 'Sífilis na Gestação',
    category: 'Obstetrícia',
    tags: ['Sífilis', 'VDRL', 'Penicilina'],
    summary: 'Tratamento da gestante e parceiro.',
    content_type: 'protocol',
    content: { steps: ['Primária/Secundária: Penicilina Benzatina 2.4mi UI (1 dose)', 'Latente/Tardia: 3 doses de 2.4mi UI (semanal)', 'Parceiro: Tratar sempre'] },
    references: ['PCDT IST 2022']
  },

  // --- CIRURGIA ---
  {
    id: 'top-cir-001',
    title: 'Trauma Abdominal Fechado',
    category: 'Cirurgia',
    tags: ['Trauma', 'FAST', 'Laparotomia'],
    summary: 'Indicações de laparotomia vs conservador.',
    content_type: 'flowchart',
    content: { steps: ['Instável + FAST positivo -> Laparotomia', 'Estável -> TC de Abdome', 'Instável + FAST negativo -> Buscar outras causas'] },
    references: ['ATLS 10ª Ed']
  },
  {
    id: 'top-cir-002',
    title: 'Queimaduras',
    category: 'Cirurgia',
    tags: ['Queimadura', 'Parkland', 'Regra dos 9'],
    summary: 'Reposição volêmica no grande queimado.',
    content_type: 'mnemonic',
    content: { items: [{ key: 'Fórmula Parkland', value: '2-4ml x kg x %SCQ' }, { key: 'Infusão', value: '50% nas primeiras 8h' }] },
    references: ['ATLS 10ª Ed']
  },

  // --- NEUROLOGIA ---
  {
    id: 'top-neuro-001',
    title: 'AVC Isquêmico',
    category: 'Neurologia',
    tags: ['AVC', 'Trombólise', 'NIHSS'],
    summary: 'Janela terapêutica e contraindicações.',
    content_type: 'protocol',
    content: { steps: ['TC sem contraste (excluir sangramento)', 'Delta T < 4.5h -> Alteplase', 'Delta T < 24h -> Trombectomia (casos selecionados)'] },
    references: ['AHA/ASA Guidelines']
  },

  // --- INFECTOLOGIA ---
  {
    id: 'top-infec-001',
    title: 'Dengue: Classificação e Manejo',
    category: 'Infectologia',
    tags: ['Dengue', 'Arbovirose', 'Hidratação'],
    summary: 'Grupos A, B, C e D.',
    content_type: 'flowchart',
    content: { steps: ['Grupo A: Sem alarme (Casa)', 'Grupo B: Sangramento/Risco (Obs + Hemograma)', 'Grupo C: Sinais de Alarme (Internação + Volume)', 'Grupo D: Choque (UTI)'] },
    references: ['MS Dengue 2024']
  },
  {
    id: 'top-infec-002',
    title: 'HIV: Início de TARV',
    category: 'Infectologia',
    tags: ['HIV', 'TARV', 'Tenofovir'],
    summary: 'Esquema preferencial inicial.',
    content_type: 'concept',
    content: { explanation: 'TDF (Tenofovir) + 3TC (Lamivudina) + DTG (Dolutegravir) é o esquema de primeira linha para virgens de tratamento.' },
    references: ['PCDT HIV 2023']
  }
];
