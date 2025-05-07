package com.yupi.mianshiya.service;

import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;

@Service
public class SensitiveWordService {

    private Set<String> sensitiveWords;
    private Map<Character, Object> sensitiveWordMap;

    @PostConstruct
    public void init() {
        // 初始化敏感词列表，实际应用中可以从数据库或配置文件加载
        sensitiveWords = new HashSet<>(Arrays.asList("傻逼", "你妈", "畜生","废物","习近平","毛泽东","逼"));
        buildSensitiveWordMap();
    }

    private void buildSensitiveWordMap() {
        sensitiveWordMap = new HashMap<>(sensitiveWords.size());
        for (String word : sensitiveWords) {
            Map<Character, Object> currentMap = sensitiveWordMap;
            for (int i = 0; i < word.length(); i++) {
                char c = word.charAt(i);
                Object wordMap = currentMap.get(c);
                if (wordMap == null) {
                    wordMap = new HashMap<Character, Object>();
                    currentMap.put(c, wordMap);
                }
                currentMap = (Map<Character, Object>) wordMap;
            }
            currentMap.put('\0', null);
        }
    }

    public String filter(String text) {
        StringBuilder result = new StringBuilder(text);
        int index = 0;
        while (index < result.length()) {
            int length = checkSensitiveWord(result.toString(), index);
            if (length > 0) {
                for (int i = index; i < index + length; i++) {
                    result.setCharAt(i, '*');
                }
                index += length;
            } else {
                index++;
            }
        }
        return result.toString();
    }

    private int checkSensitiveWord(String text, int beginIndex) {
        Map<Character, Object> currentMap = sensitiveWordMap;
        int wordLength = 0;
        for (int i = beginIndex; i < text.length(); i++) {
            char c = text.charAt(i);
            Object wordMap = currentMap.get(c);
            if (wordMap != null) {
                wordLength++;
                if (((Map<Character, Object>) wordMap).containsKey('\0')) {
                    return wordLength;
                }
                currentMap = (Map<Character, Object>) wordMap;
            } else {
                break;
            }
        }
        return 0;
    }
}