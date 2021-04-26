// <copyright file="SampleObserver.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace Sample.Common.Logging
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Graph.Communications.Common.Telemetry;

    /// <summary>
    /// Memory logger for quick diagnostics.
    /// Note: Do not use in production code.
    /// </summary>
    public class SampleObserver : IObserver<LogEvent>, IDisposable
    {
        private static readonly int MaxLogCount = 5000;

        /// <summary>
        /// Observer subscription.
        /// </summary>
        private IDisposable subscription;

        /// <summary>
        /// Linked list representing the logs.
        /// </summary>
        private LinkedList<string> logs = new LinkedList<string>();

        /// <summary>
        /// Lock for securing logs.
        /// </summary>
        private object lockLogs = new object();

        /// <summary>
        /// The formatter.
        /// </summary>
        private ILogEventFormatter formatter = new CommsLogEventFormatter();

        /// <summary>
        /// Initializes a new instance of the <see cref="SampleObserver" /> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        public SampleObserver(IGraphLogger logger)
        {
            // Log unhandled exceptions.
            AppDomain.CurrentDomain.UnhandledException += (_, e) => logger.Error(e.ExceptionObject as Exception, $"Unhandled exception");
            TaskScheduler.UnobservedTaskException += (_, e) => logger.Error(e.Exception, "Unobserved task exception");

            this.subscription = logger.Subscribe(this);
        }

        /// <summary>
        /// Get the complete or portion of the logs.
        /// </summary>
        /// <param name="skip">Skip number of entries.</param>
        /// <param name="take">Pagination size.</param>
        /// <returns>Log entries.</returns>
        public string GetLogs(int skip = 0, int take = int.MaxValue)
        {
            lock (this.lockLogs)
            {
                skip = skip < 0 ? Math.Max(0, this.logs.Count + skip) : skip;
                var filteredLogs = this.logs
                    .Skip(skip)
                    .Take(take);
                return string.Join(Environment.NewLine, filteredLogs);
            }
        }

        /// <summary>
        /// Get the complete or portion of the logs.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <param name="skip">Skip number of entries.</param>
        /// <param name="take">Pagination size.</param>
        /// <returns>
        /// Log entries.
        /// </returns>
        public string GetLogs(string filter, int skip = 0, int take = int.MaxValue)
        {
            lock (this.lockLogs)
            {
                skip = skip < 0 ? Math.Max(0, this.logs.Count + skip) : skip;
                var filteredLogs = this.logs
                    .Where(log => log.IndexOf(filter, StringComparison.OrdinalIgnoreCase) >= 0)
                    .Skip(skip)
                    .Take(take);
                return string.Join(Environment.NewLine, filteredLogs);
            }
        }

        /// <inheritdoc />
        public void OnNext(LogEvent logEvent)
        {
            // Do nothing for metrics for now.
            if (logEvent.EventType == LogEventType.Metric)
            {
                return;
            }

            // Log only http traces if enabled.
            if (logEvent.EventType != LogEventType.HttpTrace)
            {
                // Unless we have an error/warning to log.
                if (logEvent.Level != TraceLevel.Error && logEvent.Level != TraceLevel.Warning)
                {
                    return;
                }
            }

            var logString = this.formatter.Format(logEvent);
            lock (this.lockLogs)
            {
                this.logs.AddFirst(logString);
                if (this.logs.Count > MaxLogCount)
                {
                    this.logs.RemoveLast();
                }
            }
        }

        /// <inheritdoc />
        public void OnError(Exception error)
        {
        }

        /// <inheritdoc />
        public void OnCompleted()
        {
        }

        /// <inheritdoc />
        public void Dispose()
        {
            lock (this.lockLogs)
            {
                this.logs?.Clear();
                this.logs = null;
            }

            this.subscription?.Dispose();
            this.subscription = null;
            this.formatter = null;
        }
    }
}
