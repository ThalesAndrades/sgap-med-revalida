<?php

$appHost = 'https://app.revalidaai.med.br';

?><!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Revalida AI — Beta com acesso vitalício</title>
    <meta name="description" content="Plataforma beta para treinar a 2ª fase do Revalida com simulações realistas e IA. Acesso por whitelist." />
    <style>
      :root{
        --bg:#0B1020;
        --surface:#111A33;
        --surface2:#0E1630;
        --text:#E5E7EB;
        --muted:#94A3B8;
        --primary:#7C3AED;
        --primary2:#6D28D9;
        --green:#22C55E;
        --red:#EF4444;
        --ring:rgba(124,58,237,.35);
      }
      *{box-sizing:border-box}
      html,body{height:100%}
      body{
        margin:0;
        font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
        background:radial-gradient(1100px 680px at 15% 10%, rgba(124,58,237,.25), transparent 55%),
                   radial-gradient(900px 520px at 85% 30%, rgba(34,197,94,.18), transparent 55%),
                   linear-gradient(180deg, #070A14, var(--bg));
        color:var(--text);
      }
      a{color:inherit;text-decoration:none}
      .container{max-width:1120px;margin:0 auto;padding:24px}
      .topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:8px 0}
      .brand{display:flex;align-items:center;gap:12px}
      .logo{
        width:40px;height:40px;border-radius:12px;
        background:linear-gradient(135deg,var(--primary),#22C55E);
        box-shadow:0 12px 40px rgba(124,58,237,.25);
      }
      .badge{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;background:rgba(148,163,184,.14);border:1px solid rgba(148,163,184,.22);font-size:12px;color:var(--muted)}
      .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:12px 16px;border-radius:14px;border:1px solid rgba(148,163,184,.18);background:rgba(17,26,51,.55);color:var(--text);font-weight:700;letter-spacing:.2px;transition:transform .15s ease, background .15s ease, border-color .15s ease, box-shadow .15s ease}
      .btn:hover{transform:translateY(-1px);background:rgba(17,26,51,.75);border-color:rgba(148,163,184,.28)}
      .btnPrimary{background:linear-gradient(135deg,var(--primary),var(--primary2));border-color:rgba(124,58,237,.35);box-shadow:0 18px 60px rgba(124,58,237,.25)}
      .btnPrimary:hover{background:linear-gradient(135deg,#8B5CF6,var(--primary2));border-color:rgba(124,58,237,.5)}
      .btnGreen{background:linear-gradient(135deg,var(--green),#16A34A);border-color:rgba(34,197,94,.35);box-shadow:0 18px 60px rgba(34,197,94,.18)}
      .btnGreen:hover{border-color:rgba(34,197,94,.5)}
      .hero{padding:46px 0 24px}
      .heroGrid{display:grid;grid-template-columns:1.15fr .85fr;gap:24px;align-items:stretch}
      @media (max-width: 980px){.heroGrid{grid-template-columns:1fr}}
      .h1{font-size:44px;line-height:1.05;margin:14px 0 12px;letter-spacing:-.8px}
      @media (max-width: 560px){.h1{font-size:36px}}
      .lead{font-size:16px;line-height:1.6;color:rgba(229,231,235,.82);margin:0 0 18px}
      .kpis{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 22px}
      .kpi{padding:10px 12px;border-radius:14px;background:rgba(17,26,51,.55);border:1px solid rgba(148,163,184,.14);font-size:13px;color:rgba(229,231,235,.86)}
      .card{
        background:linear-gradient(180deg, rgba(17,26,51,.82), rgba(14,22,48,.72));
        border:1px solid rgba(148,163,184,.16);
        border-radius:20px;
        box-shadow:0 20px 70px rgba(0,0,0,.35);
      }
      .cardPad{padding:18px}
      .illus{
        height:100%;
        border-radius:20px;
        background:
          radial-gradient(420px 240px at 30% 25%, rgba(124,58,237,.25), transparent 60%),
          radial-gradient(420px 240px at 70% 60%, rgba(34,197,94,.18), transparent 60%),
          linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
        border:1px solid rgba(148,163,184,.16);
        padding:18px;
        display:flex;
        flex-direction:column;
        gap:14px;
      }
      .illusTitle{display:flex;align-items:center;justify-content:space-between;gap:12px}
      .pill{font-size:12px;font-weight:800;padding:6px 10px;border-radius:999px;background:rgba(124,58,237,.18);border:1px solid rgba(124,58,237,.28)}
      .mock{flex:1;border-radius:16px;background:rgba(7,10,20,.55);border:1px solid rgba(148,163,184,.12);padding:14px;display:grid;gap:10px}
      .row{display:flex;gap:10px;align-items:center}
      .dot{width:10px;height:10px;border-radius:999px;background:rgba(148,163,184,.28)}
      .bar{height:10px;border-radius:999px;background:linear-gradient(90deg, rgba(124,58,237,.6), rgba(34,197,94,.55));flex:1;opacity:.9}
      .small{font-size:12px;color:rgba(148,163,184,.92);line-height:1.5}
      .section{padding:18px 0}
      .sectionTitle{font-size:22px;letter-spacing:-.2px;margin:0 0 10px}
      .sectionSub{color:rgba(148,163,184,.95);margin:0 0 14px;line-height:1.6}
      .formRow{display:flex;gap:10px;flex-wrap:wrap}
      .input{
        flex:1;min-width:220px;
        padding:12px 14px;border-radius:14px;
        border:1px solid rgba(148,163,184,.2);
        background:rgba(7,10,20,.55);
        color:var(--text);
        outline:none;
      }
      .input:focus{box-shadow:0 0 0 4px var(--ring);border-color:rgba(124,58,237,.45)}
      .note{margin-top:12px;font-size:13px;color:rgba(148,163,184,.95)}
      .status{margin-top:12px;padding:12px 14px;border-radius:16px;border:1px solid rgba(148,163,184,.16);background:rgba(7,10,20,.35);display:none}
      .status.show{display:block}
      .status.ok{border-color:rgba(34,197,94,.28);background:rgba(34,197,94,.08)}
      .status.bad{border-color:rgba(239,68,68,.25);background:rgba(239,68,68,.06)}
      .pricingGrid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
      @media (max-width: 980px){.pricingGrid{grid-template-columns:1fr}}
      .priceCard{padding:18px;border-radius:20px;border:1px solid rgba(148,163,184,.16);background:rgba(7,10,20,.25)}
      .priceName{font-size:13px;color:rgba(148,163,184,.95);font-weight:800;text-transform:uppercase;letter-spacing:.8px}
      .price{font-size:40px;letter-spacing:-.6px;margin:8px 0 4px;font-weight:900}
      .priceSub{color:rgba(148,163,184,.95);margin:0 0 10px}
      .ul{margin:12px 0 0;padding-left:18px;color:rgba(229,231,235,.88);line-height:1.65}
      .footer{padding:26px 0 40px;color:rgba(148,163,184,.9);font-size:12px}
      .hr{height:1px;background:rgba(148,163,184,.14);margin:16px 0}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="topbar">
        <div class="brand">
          <div class="logo" aria-hidden="true"></div>
          <div>
            <div style="font-weight:900;letter-spacing:-.2px">Revalida AI</div>
            <div style="font-size:12px;color:rgba(148,163,184,.9)">Plataforma beta para a 2ª fase</div>
          </div>
        </div>
        <a class="btn" href="<?php echo htmlspecialchars($appHost, ENT_QUOTES); ?>/login">Acessar</a>
      </div>

      <div class="hero">
        <div class="heroGrid">
          <div>
            <div class="badge">Beta fechado • acesso por whitelist • vagas limitadas</div>
            <h1 class="h1">Treine o Revalida como se fosse o dia da prova.</h1>
            <p class="lead">Simulações realistas, correção inteligente, voz e fluxo de estação. Você entra no ritmo do exame e ganha clareza do que fazer sob pressão.</p>
            <div class="kpis">
              <div class="kpi">Simulação modo prova</div>
              <div class="kpi">Casos gerados por IA</div>
              <div class="kpi">Feedback estruturado</div>
              <div class="kpi">Experiência premium vitalícia</div>
            </div>
            <div class="card cardPad">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap">
                <div>
                  <div style="font-weight:900;letter-spacing:-.2px">Entre na whitelist do beta</div>
                  <div style="color:rgba(148,163,184,.95);margin-top:6px;line-height:1.6">Deixe seu e-mail para validar acesso. Se estiver autorizado, você recebe o caminho para entrar e garantir o valor vitalício.</div>
                </div>
                <div class="pill">Oferta de lançamento</div>
              </div>
              <div class="hr"></div>
              <div class="formRow">
                <input id="email" class="input" type="email" inputmode="email" autocomplete="email" placeholder="seuemail@exemplo.com" />
                <button id="btnCheck" class="btn btnPrimary" type="button">Verificar acesso</button>
                <button id="btnJoin" class="btn" type="button">Entrar na lista</button>
              </div>
              <div id="status" class="status"></div>
              <div class="note">Ao enviar, você concorda em receber comunicações sobre o beta. Sem spam.</div>
            </div>
          </div>

          <div class="illus">
            <div class="illusTitle">
              <div style="font-weight:900;letter-spacing:-.2px">O que você recebe no beta</div>
              <div class="badge">Atualizações semanais</div>
            </div>
            <div class="mock" aria-hidden="true">
              <div class="row"><div class="dot"></div><div class="bar"></div></div>
              <div class="row"><div class="dot"></div><div class="bar" style="opacity:.65"></div></div>
              <div class="row"><div class="dot"></div><div class="bar" style="opacity:.8"></div></div>
              <div class="row"><div class="dot"></div><div class="bar" style="opacity:.55"></div></div>
              <div style="display:grid;gap:10px;margin-top:6px">
                <div class="priceCard" style="padding:14px">
                  <div style="font-weight:900">Simulação real</div>
                  <div class="small">Cronômetro + examinador + checklist por critérios.</div>
                </div>
                <div class="priceCard" style="padding:14px">
                  <div style="font-weight:900">Base de conhecimento</div>
                  <div class="small">Protocolos, mnemônicos e revisão focada no que cai.</div>
                </div>
              </div>
            </div>
            <div class="small">Você participa do beta ajudando a otimizar desempenho e custos. Por isso, o grupo reduz o valor por pessoa.</div>
          </div>
        </div>
      </div>

      <div class="section" id="precos">
        <h2 class="sectionTitle">Preços de lançamento (beta)</h2>
        <p class="sectionSub">Acesso vitalício com pagamento único. Sem mensalidade. O valor sobe quando o beta fechar.</p>
        <div class="pricingGrid">
          <div class="card priceCard">
            <div class="priceName">Acesso vitalício</div>
            <div class="price">R$ 799</div>
            <div class="priceSub">Pagamento único • para 1 usuário</div>
            <ul class="ul">
              <li>Uso ilimitado da plataforma</li>
              <li>Atualizações incluídas durante o beta</li>
              <li>Prioridade em novos recursos</li>
            </ul>
          </div>
          <div class="card priceCard" style="border-color:rgba(34,197,94,.22)">
            <div class="priceName">Grupo (até 3)</div>
            <div class="price">R$ 600</div>
            <div class="priceSub">por pessoa • pagamento único</div>
            <ul class="ul">
              <li>Junte até 3 pessoas</li>
              <li>Preço menor por otimização do servidor</li>
              <li>Acesso vitalício individual para cada conta</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="hr"></div>
        <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
          <div>© <?php echo date('Y'); ?> Revalida AI • Beta fechado</div>
          <a href="<?php echo htmlspecialchars($appHost, ENT_QUOTES); ?>/login" class="badge">Entrar no app</a>
        </div>
      </div>
    </div>

    <script>
      const appHost = <?php echo json_encode($appHost); ?>;
      const els = {
        email: document.getElementById('email'),
        btnCheck: document.getElementById('btnCheck'),
        btnJoin: document.getElementById('btnJoin'),
        status: document.getElementById('status')
      };

      function setStatus(type, text, actionsHtml) {
        els.status.className = 'status show ' + (type || '');
        els.status.innerHTML = '<div style="font-weight:800">' + text + '</div>' + (actionsHtml ? ('<div style="margin-top:10px">' + actionsHtml + '</div>') : '');
      }

      async function postJSON(url, body) {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = (data && data.error) ? data.error : 'Erro ao processar';
          throw new Error(msg);
        }
        return data;
      }

      function getEmail() {
        return (els.email.value || '').trim().toLowerCase();
      }

      async function checkAccess() {
        const email = getEmail();
        if (!email) {
          setStatus('bad', 'Digite um e-mail válido para verificar acesso.');
          return;
        }
        els.btnCheck.disabled = true;
        els.btnJoin.disabled = true;
        setStatus('', 'Verificando acesso...');
        try {
          const data = await postJSON(appHost + '/api/whitelist/check.php', { email });
          if (data.allowed) {
            setStatus('ok', 'Seu e-mail está autorizado para o beta.',
              '<a class="btn btnGreen" href="' + appHost + '/login">Entrar no app</a>'
            );
          } else {
            setStatus('bad', 'Ainda não liberamos acesso para este e-mail.',
              '<div class="small">Entre na lista para receber prioridade conforme novas vagas abrirem.</div>'
            );
          }
        } catch (e) {
          setStatus('bad', String(e && e.message ? e.message : 'Falha ao verificar')); 
        } finally {
          els.btnCheck.disabled = false;
          els.btnJoin.disabled = false;
        }
      }

      async function joinWaitlist() {
        const email = getEmail();
        if (!email) {
          setStatus('bad', 'Digite um e-mail válido para entrar na lista.');
          return;
        }
        els.btnCheck.disabled = true;
        els.btnJoin.disabled = true;
        setStatus('', 'Registrando seu e-mail...');
        try {
          await postJSON(appHost + '/api/whitelist/signup.php', { email, source: 'landing-root' });
          setStatus('ok', 'Pronto. Você entrou na whitelist de interesse.', '<div class="small">Se você já tiver convite, use o mesmo e-mail para criar conta no app.</div>');
        } catch (e) {
          setStatus('bad', String(e && e.message ? e.message : 'Falha ao registrar'));
        } finally {
          els.btnCheck.disabled = false;
          els.btnJoin.disabled = false;
        }
      }

      els.btnCheck.addEventListener('click', checkAccess);
      els.btnJoin.addEventListener('click', joinWaitlist);
    </script>
  </body>
</html>

