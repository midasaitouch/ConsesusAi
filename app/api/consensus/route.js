import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { category, product, budget, usage, preferences } = body

    if (!category || !product || !budget || !usage) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 })
    }

    const prompt = `És um especialista em produtos de consumo português. O utilizador quer:

Categoria: ${category}
Produto: ${product}
Orçamento: ${budget}€
Uso principal: ${usage}
Preferências: ${preferences || 'Nenhuma'}

Recomenda os 5 MELHORES produtos disponíveis em Portugal com preços realistas em euros.
Responde APENAS com JSON válido:
{"consensusNote":"resumo","products":[{"rank":1,"name":"Produto","score":18.5,"avgPrice":499,"pros":["pro1"],"cons":["con1"],"bestFor":"Para quem","badge":"Melhor Escolha"}],"topPick":"produto","budgetPick":"produto"}`

    const res = await fetch('https://blockrun.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'nvidia/llama-4-maverick',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data?.error?.message || 'Erro na API' }, { status: 502 })
    }

    const raw = data?.choices?.[0]?.message?.content || ''
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const match = clean.match(/\{[\s\S]*\}/)

    if (!match) {
      return NextResponse.json({ error: 'Resposta inválida da IA. Tente novamente.' }, { status: 502 })
    }

    const parsed = JSON.parse(match[0])

    if (!Array.isArray(parsed.products) || parsed.products.length === 0) {
      return NextResponse.json({ error: 'Estrutura inválida. Tente novamente.' }, { status: 502 })
    }

    parsed.products = parsed.products.slice(0, 5).map((p, i) => ({
      rank: i + 1,
      name: p.name || `Produto ${i + 1}`,
      score: Math.min(20, Math.max(14, Number(p.score) || 16)),
      avgPrice: Number(p.avgPrice) || 500,
      pros: Array.isArray(p.pros) ? p.pros.slice(0, 4) : ['Boa qualidade'],
      cons: Array.isArray(p.cons) ? p.cons.slice(0, 3) : ['Ver especificações'],
      bestFor: p.bestFor || '',
      badge: p.badge || 'Melhor Escolha',
    }))

    return NextResponse.json(parsed)
  } catch (e) {
    console.error('[ConsensusAI]', e.message)
    return NextResponse.json({ error: e.message || 'Erro interno.' }, { status: 500 })
  }
}
