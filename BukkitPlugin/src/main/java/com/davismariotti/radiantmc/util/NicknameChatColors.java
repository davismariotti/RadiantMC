package com.davismariotti.radiantmc.util;

import java.util.HashSet;
import java.util.Set;
import org.bukkit.ChatColor;

public class NicknameChatColors {

    private static final Set<ChatColor> desiredChatColors = new HashSet<>() {{
        add(ChatColor.DARK_RED);
        add(ChatColor.RED);
        add(ChatColor.GOLD);
        add(ChatColor.GREEN);
        add(ChatColor.AQUA);
        add(ChatColor.DARK_AQUA);
        add(ChatColor.BLUE);
        add(ChatColor.LIGHT_PURPLE);
    }};

    public static Set<ChatColor> getDesiredChatColors() {
        return new HashSet<>(desiredChatColors);
    }

}
