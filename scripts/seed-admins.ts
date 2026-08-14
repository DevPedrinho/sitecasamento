/**
 * Cria (ou atualiza) as contas de administrador de Deysiane e Pedro no Firebase.
 *
 * Como usar:
 *   1. No Firebase Console > Configurações do projeto > Contas de serviço, gere uma
 *      "nova chave privada" e salve o JSON como ./service-account.json (não commitar).
 *   2. Edite a lista ADMINS abaixo com o e-mail/senha/nome de cada um.
 *   3. Rode: npm run seed:admins
 *
 * O script usa o Firebase Admin SDK, que ignora as regras de segurança do Firestore
 * — por isso essa etapa manual/local é necessária para criar o primeiro admin.
 */
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "node:fs";

const ADMINS = [
  { email: "deysiane@example.com", password: "TrocarEssaSenha123!", displayName: "Deysiane" },
  { email: "pedro@example.com", password: "TrocarEssaSenha123!", displayName: "Pedro" },
];

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./service-account.json";

if (!existsSync(credentialsPath)) {
  console.error(
    `Arquivo de credenciais não encontrado em "${credentialsPath}".\n` +
      "Gere uma chave de service account no Firebase Console e configure GOOGLE_APPLICATION_CREDENTIALS " +
      "(ou salve o arquivo como ./service-account.json) antes de rodar este script."
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(credentialsPath, "utf-8"));

initializeApp({
  credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
});

async function seedAdmins() {
  const auth = getAuth();
  const db = getFirestore();

  for (const admin of ADMINS) {
    let uid: string;
    try {
      const existing = await auth.getUserByEmail(admin.email);
      uid = existing.uid;
      await auth.updateUser(uid, { password: admin.password, displayName: admin.displayName });
      console.log(`Atualizado: ${admin.email} (${uid})`);
    } catch {
      const created = await auth.createUser({
        email: admin.email,
        password: admin.password,
        displayName: admin.displayName,
        emailVerified: true,
      });
      uid = created.uid;
      console.log(`Criado: ${admin.email} (${uid})`);
    }

    await db.collection("users").doc(uid).set({
      role: "admin",
      guestId: null,
      displayName: admin.displayName,
    });
  }

  console.log("\nPronto! Troque as senhas padrão assim que possível.");
}

seedAdmins().catch((err) => {
  console.error(err);
  process.exit(1);
});
