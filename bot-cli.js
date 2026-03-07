const readline = require("readline-sync");

function menu() {
  console.log("\n🤖 Bot da Clínica");
  console.log("1️⃣ Agendar avaliação");
  console.log("2️⃣ Procedimentos");
  console.log("3️⃣ Localização");
  console.log("4️⃣ Falar com atendente");
}

function procedimentos() {
  console.log("\n💉 Procedimentos disponíveis:");
  console.log("- Botox");
  console.log("- Preenchimento labial");
  console.log("- Lipo de papada");
}

function localizacao() {
  console.log("\n📍 Estamos localizados em Recife.");
  console.log("https://maps.google.com");
}

function agendamento() {
  const nome = readline.question("\nInforme seu nome: ");
  const dia = readline.question("Melhor dia para consulta: ");

  console.log(`\n✅ Obrigado ${nome}!`);
  console.log(`Sua solicitação para ${dia} foi registrada.`);
}

function iniciarBot() {
  console.log("👋 Olá! Bem-vindo à clínica.");
  
  while (true) {
    menu();

    const opcao = readline.question("\nEscolha uma opcao: ");

    if (opcao === "1") {
      agendamento();
    }

    else if (opcao === "2") {
      procedimentos();
    }

    else if (opcao === "3") {
      localizacao();
    }

    else if (opcao === "4") {
      console.log("\n👩‍💼 Um atendente irá falar com você em breve.");
    }

    else {
      console.log("\n❌ Opção inválida.");
    }
  }
}

iniciarBot();