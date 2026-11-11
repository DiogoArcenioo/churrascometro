import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface ResultadoCalculo {
  carne: number;
  bebida: number;
  duracaoHoras: number;
  totalPessoas: number;
}

export default function Index() {
  const [numeroAdultos, setNumeroAdultos] = useState("");
  const [numeroCriancas, setNumeroCriancas] = useState("");
  const [duracao, setDuracao] = useState("");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const calcularQuantidade = () => {
    Keyboard.dismiss();

    const adultos = parseInt(numeroAdultos, 10) || 0;
    const criancas = parseInt(numeroCriancas, 10) || 0;
    const duracaoHoras = parseInt(duracao, 10) || 0;

    if (adultos <= 0 && criancas <= 0) {
      setErro("Informe ao menos um adulto ou criança para calcular.");
      setResultado(null);
      return;
    }

    setErro(null);

    // Regra de consumo (gramas e ml)
    const carnePorAdulto = duracaoHoras >= 6 ? 650 : 400; // gramas
    const carnePorCrianca = carnePorAdulto / 2; // gramas

    const bebidaPorAdulto = duracaoHoras >= 6 ? 2000 : 1200; // ml
    const bebidaPorCrianca = bebidaPorAdulto / 2; // ml

    const totalCarne = (adultos * carnePorAdulto + criancas * carnePorCrianca) / 1000; // kg
    const totalBebida = (adultos * bebidaPorAdulto + criancas * bebidaPorCrianca) / 1000; // litros

    setResultado({
      carne: totalCarne,
      bebida: totalBebida,
      duracaoHoras,
      totalPessoas: adultos + criancas,
    });
  };

  const limparCampos = () => {
    setNumeroAdultos("");
    setNumeroCriancas("");
    setDuracao("");
    setResultado(null);
    setErro(null);
    Keyboard.dismiss();
  };

  const formatarNumero = (valor: number) => {
    return parseFloat(valor.toFixed(2)).toString().replace(".", ",");
  };

  const temDados = Boolean(numeroAdultos || numeroCriancas || duracao || resultado);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Card */}
          <View style={styles.card}>
            <View style={styles.heroRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.heroEmoji}>🔥</Text>
              </View>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>Churrascômetro</Text>
                <Text style={styles.heroSubtitle}>
                  Calcule a quantidade ideal de carne e bebidas sem desperdício.
                </Text>
              </View>
            </View>

            <View style={styles.tipsBox}>
              <Text style={styles.tipsTitle}>💡 Como funciona o cálculo:</Text>
              <Text style={styles.tipItem}>
                • <Text style={styles.tipBold}>Até 5 horas:</Text> 400g de carne e 1,2L de bebida por adulto.
              </Text>
              <Text style={styles.tipItem}>
                • <Text style={styles.tipBold}>6 horas ou mais:</Text> 650g de carne e 2,0L de bebida por adulto.
              </Text>
              <Text style={styles.tipItem}>
                • <Text style={styles.tipBold}>Crianças:</Text> consomem metade da porção de um adulto.
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Preencha os dados</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>👥 Número de adultos</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 10"
                placeholderTextColor="#94A3B8"
                value={numeroAdultos}
                onChangeText={(text) => {
                  setNumeroAdultos(text);
                  if (erro) setErro(null);
                }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>🧒 Número de crianças</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 4"
                placeholderTextColor="#94A3B8"
                value={numeroCriancas}
                onChangeText={(text) => {
                  setNumeroCriancas(text);
                  if (erro) setErro(null);
                }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>⏱️ Duração do churrasco (horas)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 4"
                placeholderTextColor="#94A3B8"
                value={duracao}
                onChangeText={(text) => {
                  setDuracao(text);
                  if (erro) setErro(null);
                }}
              />
            </View>

            {erro && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {erro}</Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={calcularQuantidade}
              >
                <Text style={styles.primaryButtonText}>Calcular Quantidade</Text>
              </TouchableOpacity>

              {temDados && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  activeOpacity={0.7}
                  onPress={limparCampos}
                >
                  <Text style={styles.secondaryButtonText}>Limpar campos</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Result Card */}
          {resultado && (
            <View style={[styles.card, styles.resultCard]}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>📋 Resultado Recomendado</Text>
                <Text style={styles.resultSubtitle}>
                  Para {resultado.totalPessoas}{" "}
                  {resultado.totalPessoas === 1 ? "convidado" : "convidados"} (
                  {resultado.duracaoHoras > 0
                    ? `${resultado.duracaoHoras}h de duração`
                    : "duração padrão"}
                  )
                </Text>
              </View>

              <View style={styles.metricGrid}>
                {/* Meat Box */}
                <View style={[styles.metricCard, styles.meatCard]}>
                  <Text style={styles.metricIcon}>🥩</Text>
                  <Text style={styles.metricLabel}>Carne Total</Text>
                  <View style={styles.metricValueRow}>
                    <Text style={styles.metricValue}>
                      {formatarNumero(resultado.carne)}
                    </Text>
                    <Text style={styles.metricUnit}>kg</Text>
                  </View>
                  <Text style={styles.metricFootnote}>
                    {resultado.duracaoHoras >= 6 ? "650g / adulto" : "400g / adulto"}
                  </Text>
                </View>

                {/* Drinks Box */}
                <View style={[styles.metricCard, styles.drinkCard]}>
                  <Text style={styles.metricIcon}>🥤</Text>
                  <Text style={styles.metricLabel}>Bebidas Total</Text>
                  <View style={styles.metricValueRow}>
                    <Text style={styles.metricValue}>
                      {formatarNumero(resultado.bebida)}
                    </Text>
                    <Text style={styles.metricUnit}>L</Text>
                  </View>
                  <Text style={styles.metricFootnote}>
                    {resultado.duracaoHoras >= 6 ? "2,0L / adulto" : "1,2L / adulto"}
                  </Text>
                </View>
              </View>

              <View style={styles.noteBox}>
                <Text style={styles.noteText}>
                  {resultado.duracaoHoras >= 6
                    ? "🔥 Duração estendida (6h+): valores calculados com taxa reforçada de consumo."
                    : "✨ Dica: caso o evento se estenda por mais de 6 horas, recalcule com a nova duração."}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 54,
    gap: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  heroEmoji: {
    fontSize: 22,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 18,
  },
  tipsBox: {
    marginTop: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  tipItem: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
  },
  tipBold: {
    fontWeight: "600",
    color: "#1E293B",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    fontSize: 13,
    color: "#B91C1C",
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: 6,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },
  resultCard: {
    borderColor: "#CBD5E1",
  },
  resultHeader: {
    marginBottom: 14,
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  resultSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  metricGrid: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  meatCard: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  drinkCard: {
    backgroundColor: "#F0F9FF",
    borderColor: "#BAE6FD",
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 4,
  },
  metricValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
  metricFootnote: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 4,
  },
  noteBox: {
    marginTop: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 10,
  },
  noteText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 16,
    textAlign: "center",
  },
});

