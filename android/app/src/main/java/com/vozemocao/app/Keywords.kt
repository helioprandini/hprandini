package com.vozemocao.app

import android.content.Context
import org.json.JSONObject
import java.text.Normalizer

/**
 * Repositório de palavras-gatilho de negócios.
 *
 * Carrega a lista base de assets/business_keywords.json e mescla com as
 * palavras personalizadas que o usuário adicionar (SharedPreferences).
 * Todo o casamento de texto é feito sem acentos e em minúsculas, para
 * tolerar variações do reconhecedor de voz.
 */
object Keywords {

    private const val PREFS = "vozemocao"
    private const val KEY_CUSTOM = "custom_keywords"

    /** Remove acentos e normaliza para minúsculas. */
    fun normalize(text: String): String {
        val decomposed = Normalizer.normalize(text.lowercase().trim(), Normalizer.Form.NFD)
        return decomposed.replace(Regex("\\p{Mn}+"), "")
    }

    /** Palavras simples (um termo) e frases (mais de um termo), já normalizadas. */
    data class KeywordSet(val words: Set<String>, val phrases: List<String>)

    fun load(context: Context): KeywordSet {
        val all = mutableListOf<String>()

        // Lista base do repositório de palavras
        try {
            val json = context.assets.open("business_keywords.json")
                .bufferedReader().use { it.readText() }
            val categorias = JSONObject(json).getJSONObject("categorias")
            for (key in categorias.keys()) {
                val arr = categorias.getJSONArray(key)
                for (i in 0 until arr.length()) all.add(arr.getString(i))
            }
        } catch (_: Exception) {
            // sem a lista base, segue apenas com as personalizadas
        }

        // Palavras personalizadas do usuário
        all.addAll(getCustom(context))

        val words = mutableSetOf<String>()
        val phrases = mutableListOf<String>()
        for (raw in all) {
            val n = normalize(raw)
            if (n.isEmpty()) continue
            if (n.contains(' ')) phrases.add(n) else words.add(n)
        }
        return KeywordSet(words, phrases)
    }

    /**
     * Verifica se o texto reconhecido contém alguma palavra-gatilho.
     * Retorna a palavra encontrada, ou null.
     */
    fun findMatch(recognizedText: String, set: KeywordSet): String? {
        val n = normalize(recognizedText)
        if (n.isEmpty()) return null

        // Frases: busca por substring (com limites de palavra)
        for (phrase in set.phrases) {
            if (Regex("\\b${Regex.escape(phrase)}\\b").containsMatchIn(n)) return phrase
        }
        // Palavras simples: interseção com os termos ditos
        for (token in n.split(Regex("[^a-z0-9]+"))) {
            if (token.isNotEmpty() && token in set.words) return token
        }
        return null
    }

    // ---- Palavras personalizadas ----

    fun getCustom(context: Context): List<String> {
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val raw = prefs.getString(KEY_CUSTOM, "") ?: ""
        return raw.split('\n').filter { it.isNotBlank() }
    }

    fun addCustom(context: Context, word: String) {
        val list = getCustom(context).toMutableList()
        if (word.isBlank() || list.any { normalize(it) == normalize(word) }) return
        list.add(word.trim())
        save(context, list)
    }

    fun removeCustom(context: Context, word: String) {
        save(context, getCustom(context).filter { it != word })
    }

    private fun save(context: Context, list: List<String>) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().putString(KEY_CUSTOM, list.joinToString("\n")).apply()
    }
}
