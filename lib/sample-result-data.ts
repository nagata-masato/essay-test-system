// サンプル採点結果データを生成する関数
export function generateSampleResult(resultId: string): any {
  // 現在の日時
  const now = new Date()

  // テストタイトルのサンプル
  const testTitles = ["SNSの匿名性について", "AI技術と社会の未来", "環境問題と持続可能な社会"]

  // ランダムなスコア（60-100点）
  const totalScore = Math.floor(Math.random() * 41) + 60

  // ランクを計算
  let rank
  if (totalScore >= 90) rank = "S"
  else if (totalScore >= 80) rank = "A"
  else if (totalScore >= 70) rank = "B+"
  else if (totalScore >= 60) rank = "B"
  else rank = "C+"

  // パーセンタイルを計算（スコアに基づく簡易計算）
  const percentile = Math.min(Math.round((totalScore / 100) * 100), 99)

  // 問1のスコア（30点満点）
  const question1Score = Math.floor((totalScore / 100) * 30)

  // 問2のスコア（70点満点）
  const question2Score = totalScore - question1Score

  // サンプル回答
  const sampleAnswers = {
    question1: {
      text: "SNSの匿名性は表現の自由を保障する一方で、誹謗中傷や偽情報の拡散といった弊害をもたらしている。筆者は匿名性の廃止を主張しつつも、弱者保護のための例外的な匿名制度の必要性を認めている。責任ある発言を促す仕組みづくりが社会インフラとなったSNSの健全な発展には不可欠だと論じている。",
      length: 140,
    },
    question2: {
      text: "SNSの匿名性については賛否両論あるが、私は条件付きで維持すべきだと考える。\n\n匿名性の最大の利点は、社会的立場や属性に関わらず誰もが自由に発言できる点だ。特に社会的弱者や少数派にとって、匿名であることは自己表現の唯一の手段となることも多い。また、内部告発や権力批判など、実名では困難な重要な社会的発言を可能にする。\n\nしかし、匿名性がもたらす問題も深刻だ。責任感の欠如から生じる誹謗中傷は、被害者に深い心の傷を負わせる。また、事実確認のないデマや偽情報が拡散されやすく、社会的混乱を招くこともある。\n\n私は、基本的に匿名性を維持しつつ、以下の対策を講じるべきだと考える。\n\n第一に、プラットフォーム事業者による適切なモデレーションの強化だ。AIを活用した自動検出システムと人間による判断を組み合わせ、明らかな誹謗中傷や偽情報を迅速に対処すべきである。\n\n第二に、重大な権利侵害があった場合に限り、裁判所の命令によって発信者情報を開示できる法的枠組みの整備が必要だ。これにより、匿名性を悪用した行為に対する抑止力となる。\n\n第三に、メディアリテラシー教育の充実が不可欠だ。情報の真偽を見極める能力や、オンラインでのコミュニケーションマナーを学校教育に取り入れるべきである。\n\n匿名性の完全な廃止は表現の自由を著しく制限し、社会的議論を萎縮させる恐れがある。一方、無制限の匿名性は他者の権利侵害を助長する。両者のバランスを取りながら、健全なオンライン空間を構築していくことが、デジタル社会における重要な課題である。",
      length: 700,
    },
  }

  // 確実にフィードバックオブジェクトを作成
  const feedback = {
    strengths: [
      "課題文の主要な論点を適切に理解し、要約できています。",
      "自分の立場を明確にし、一貫した主張を展開できています。",
      "論理的な構成で説得力のある文章になっています。",
      "具体例を効果的に用いて説明できています。",
    ],
    improvements: [
      "さらに多様な視点からの検討があるとより良いでしょう。",
      "一部の主張については、より具体的な根拠があるとさらに説得力が増します。",
      "結論部分をより明確にすると、文章全体の印象が向上します。",
    ],
    overall_assessment:
      "全体として、課題文の理解度が高く、論理的な文章が書けています。自分の意見を明確に示し、根拠を挙げて説明する力が見られます。さらに多様な視点を取り入れることで、より深みのある議論が展開できるでしょう。",
  }

  // 確実にscoresオブジェクトを作成
  const scores = {
    question1: {
      total: question1Score,
      max: 30,
      breakdown: {
        "要点の把握": {
          score: Math.floor(question1Score * 0.5),
          max: 15,
          comment: "筆者の主張を概ね正確に把握できています。",
          reasoning: "課題文の主要な論点を理解し、要約できています。",
        },
        "要点の整理・取捨選択": {
          score: Math.floor(question1Score * 0.25),
          max: 7,
          comment: "重要な論点を適切に選択できています。",
          reasoning: "限られた字数の中で重要な情報を選択できています。",
        },
        "表現力・論理性・字数": {
          score: Math.floor(question1Score * 0.15),
          max: 5,
          comment: "論理的な文章で適切に表現されています。",
          reasoning: "文章の構成が明確で、読みやすい表現になっています。",
        },
        "独自の意見や主張の混入": {
          score: Math.floor(question1Score * 0.1),
          max: 3,
          comment: "要約に自分の意見を混入させていません。",
          reasoning: "客観的な要約ができています。",
        },
      },
    },
    question2: {
      total: question2Score,
      max: 70,
      breakdown: {
        "課題文の論旨の理解と活用": {
          score: Math.floor(question2Score * 0.3),
          max: 20,
          comment: "課題文の内容を適切に理解し、自分の意見の根拠として活用できています。",
          reasoning: "課題文の主要な論点を踏まえた議論が展開されています。",
        },
        "自分自身の明確な意見・立場": {
          score: Math.floor(question2Score * 0.2),
          max: 15,
          comment: "自分の立場が明確に示されています。",
          reasoning: "論点に対する自分の考えが明確に述べられています。",
        },
        "論理性・構成力": {
          score: Math.floor(question2Score * 0.2),
          max: 15,
          comment: "論理的な構成で説得力のある文章になっています。",
          reasoning: "主張とその根拠が明確に関連付けられています。",
        },
        "具体例・体験・資料の活用": {
          score: Math.floor(question2Score * 0.15),
          max: 10,
          comment: "具体例を効果的に用いて説明できています。",
          reasoning: "抽象的な議論だけでなく、具体的な事例も挙げられています。",
        },
        "表現力・文章力・文法": {
          score: Math.floor(question2Score * 0.08),
          max: 5,
          comment: "適切な表現で文章が書かれています。",
          reasoning: "文法的に正確で、読みやすい文章になっています。",
        },
        "字数・課題対応": {
          score: Math.floor(question2Score * 0.07),
          max: 5,
          comment: "字数制限内で課題に適切に対応しています。",
          reasoning: "制限字数内で課題に対する回答が十分に展開されています。",
        },
      },
    },
    feedback: feedback,
  }

  // サンプル採点結果データ
  return {
    id: resultId,
    testId: `sample-test-${Math.floor(Math.random() * 3)}`,
    testTitle: testTitles[Math.floor(Math.random() * testTitles.length)],
    totalScore,
    maxScore: 100,
    rank,
    percentile,
    submittedAt: now.toISOString(),
    scores: scores,
    answers: sampleAnswers,
    answer1: sampleAnswers.question1.text,
    answer2: sampleAnswers.question2.text,
    debug: {
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      serverTime: now.toISOString(),
      isSampleData: true,
    },
  }
}
