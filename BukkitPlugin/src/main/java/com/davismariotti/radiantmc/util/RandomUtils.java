package com.davismariotti.radiantmc.util;

import com.google.common.collect.Iterables;
import java.util.Collection;
import java.util.Random;

public class RandomUtils {

    public static <T> T getRandomObject(Collection<T> from, T defaultValue) {
        Random rnd = new Random();
        int i = rnd.nextInt(from.size());
        return Iterables.get(from, i, defaultValue);
    }

    public static <T> T getRandomObject(Collection<T> from) {
        return getRandomObject(from, null);
    }
}
