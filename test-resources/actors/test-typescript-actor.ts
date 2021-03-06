/*
 * Copyright (c) 2016-2017 Untu, Inc.
 * This code is licensed under Eclipse Public License - v 1.0.
 * The full license text can be found in LICENSE.txt file and
 * on the Eclipse official site (https://www.eclipse.org/legal/epl-v10.html).
 */

import {exclamation} from './test-typescript-actor-dependency';

export default class TestActor {
  hello(text: string): string {
    return `Hello ${text}${exclamation}`;
  }
}